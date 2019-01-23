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
Compile.prototype.compile.elementNodes = function(node) {
    if (node.hasAttributes() && this.bindPriority(node)) return false;

    const attributes = [].slice.call(node.attributes);

    attributes.map(attribute => {
        const attributeName = attribute.name;
        const attributeValue = attribute.value.trim();

        if (attributeName.indexOf(configure.identifier.bind) === 0 && attributeValue !== '') {
            const directiveName = attributeName.slice(configure.identifier.bind.length);

            this.bindDirective({
                node,
                expression: attributeValue,
                name: directiveName,
            });
            node.removeAttribute(attributeName);
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
Compile.prototype.compile.textNodes = function(node) {
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
Compile.prototype.bindDirective = function(options) {
    options.compile = this;
    new Directive(options);
};

/**
 * bind attribute.
 *
 * @param {Node} node
 * @param {Node} attribute
 */
Compile.prototype.bindAttribute = function(node, attribute) {
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
Compile.prototype.bindPriority = function(node) {
    for (let i = 0; i < configure.priority.length; i++) {
        const directive = configure.priority[i];
        let attributeValue = node.getAttribute(`${configure.identifier.bind}${directive}`);

        if (attributeValue) {
            attributeValue = attributeValue.trim();
            if (!attributeValue) return false;

            node.removeAttribute(`${configure.identifier.bind}${directive}`);
            this.bindDirective({
                node,
                name: directive,
                expression: attributeValue,
            });

            return true;
        } else {
            return false;
        }
    }
};