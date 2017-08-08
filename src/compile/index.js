import walk from './walk';
import parse from './parse';
import domify from './domify';
import defaults from './defaults';
import extend from '../common/extend';
import configure from '../configure';
import Directive from '../directive';
import { hasInterpolation } from './utils';

export default function Compile(template, options = {}) {
    if (!(this instanceof Compile)) return new Compile(template, options);

    if (template instanceof Node) {
        options.template = template;
    } else if (typeof template === 'string') {
        [template] = domify(template);
        options.template = template;
    } else if (typeof template !== 'string') {
        options = template;
    }

    this.options = extend(true, defaults, options);
    this.data = this.options.data;
    template = this.options.template;

    walk(template, (node, next) => {
        if (node.nodeType === 1) {
            const skip = this.compile.elementNodes.call(this, node);
            return next(skip === false);
        } else if (node.nodeType === 3) {
            this.compile.textNodes.call(this, node);
        }
        next();
    });

    this.view = template;
    template = null;
}

Compile.prototype.compile = {};

/**
 * compile element nodes
 *
 * @param {Node} node
 * @return {Void|Boolean}
 */
Compile.prototype.compile.elementNodes = function (node) {
    let attributes = [].slice.call(node.attributes),
        attrName = ``,
        attrValue = ``,
        directiveName = ``;

    if (node.hasAttributes() && this.bindPriority(node)) return false;

    attributes.map(attribute => {
        attrName = attribute.name;
        attrValue = attribute.value.trim();

        if (attrName.indexOf(configure.identifier.bind) === 0 && attrValue !== '') {
            directiveName = attrName.slice(configure.identifier.bind.length);

            this.bindDirective({
                node,
                expression: attrValue,
                name: directiveName,
            });
            node.removeAttribute(attrName);
        } else {
            this.bindAttribute(node, attribute);
        }
    });
};

/**
 * compile text nodes.
 *
 * @param {Node} node
 * @return {Void|Boolean}
 */
Compile.prototype.compile.textNodes = function (node) {
    if (node.textContent.trim() === '') return false;

    this.bindDirective({
        node,
        name: 'text',
        expression: parse.text(node.textContent),
    });
};

/**
 * bind directive
 *
 * @param {Object} options - directive options
 */
Compile.prototype.bindDirective = function (options) {
    options.compile = this;
    new Directive(options);
};

/**
 * bind attribute.
 *
 * @param {Node} node
 * @param {Node} attribute
 */
Compile.prototype.bindAttribute = function (node, attribute) {
    if (!hasInterpolation(attribute.value) || attribute.value.trim() == '') return false;

    this.bindDirective({
        node,
        name: 'attribute',
        expression: parse.text(attribute.value),
        attrName: attribute.name,
    });
};

/**
 * bind priority directive.
 *
 * @param {Node} node
 * @return {Boolean}
 */
Compile.prototype.bindPriority = function (node) {
    let attrValue, directive;

    for (let i = 0; i < configure.priority.length; i++) {
        directive = configure.priority[i];
        attrValue = node.getAttribute(`${configure.identifier.bind}${directive}`);

        if (attrValue) {
            attrValue = attrValue.trim();
            if (!attrValue) return false;

            node.removeAttribute(`${configure.identifier.bind}${directive}`);
            this.bindDirective({
                node,
                name: directive,
                expression: attrValue,
            });

            return true;
        } else {
            return false;
        }
    }
};
