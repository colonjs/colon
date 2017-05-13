import walk from './walk';
import parse from './parse';
import domify from './domify';
import defaults from './defaults';
import extend from '../utils/extend';
import configure from '../configure';
import Directive from '../directive';

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
    this.co = this.options.co;
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

    this.template = template;
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
        directiveName = ``,
        expression = ``;

    if (node.hasAttributes() && this.bindPriority(node)) return false;

    attributes.map(attribute => {
        attrName = attribute.name;
        expression = attribute.value.trim();

        if (attrName.indexOf(configure.identifier.bind) === 0) {
            directiveName = attrName.slice(configure.identifier.bind.length);

            this.bindDirective({
                node,
                expression,
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

    const segments = parse.text(node.textContent);

    if (!segments.length) return false;

    segments.map(segment => {
        // if is directive text node.
        if (segment.isDirective) {
            const el = document.createTextNode('');
            node.parentNode.insertBefore(el, node);
            this.bindDirective({
                node: el,
                name: 'text',
                expression: segment.value,
            });
        } else {
            // common text node
            node.parentNode.insertBefore(document.createTextNode(segment.value), node);
        }
    });

    node.parentNode.removeChild(node);
};

/**
 * bind directive
 *
 * @param {Object} options - directive options
 */
Compile.prototype.bindDirective = function (options) {
    new Directive({
        ...options,
        co: this.co,
        data: this.options.data,
    });
};

/**
 * bind attribute.
 *
 * @param {Node} node
 * @param {Node} attribute
 */
Compile.prototype.bindAttribute = function (node, attribute) {
    const [segments] = parse.text(attribute.value);

    if (!segments) return void 0;

    this.bindDirective({
        node,
        name: 'attribute',
        expression: segments.value,
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
    let expression,
        directive;

    for (let i = 0; i < configure.priority.length; i++) {
        directive = configure.priority[i];
        expression = node.getAttribute(`${configure.identifier.bind}${directive}`);

        if (expression) {
            expression = expression.trim();
            node.removeAttribute(`${configure.identifier.bind}${directive}`);
            this.bindDirective({
                node,
                name: directive,
                expression,
            });
            return true;
        } else {
            return false;
        }
    }
};
