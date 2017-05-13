import walk from './walk';
import domify from './domify';
import defaults from './defaults';
import extend from '../utils/extend';

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
            const skip = this.compile.elementNodes(node);
            return next(skip === false);
        } else if (node.nodeType === 3) {
            this.compile.textNodes(node);
        }
        next();
    });

    this.template = template;
    template = null;
}

Compile.prototype.compile = {};

Compile.prototype.compile.elementNodes = function () {
    // compile element nodes
};

Compile.prototype.compile.textNodes = function () {
    // compile text nodes
};
