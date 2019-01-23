
/*
 * colon.js v1.3.2
 * (c) 2017 JustClear <576839360@qq.com>
 * https://github.com/colonjs/colon
 * Released under the MIT License.
**/

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.colon = factory();
}(typeof self !== 'undefined' ? self : this, function () { 'use strict';

    /**
     * walk dom element
     *
     * @param {DOM}   el
     * @param {Function}   action
     * @param {Function} done
     */
    function walk(el, action, done) {
        var nodes = el.childNodes && [].slice.call(el.childNodes);

        done = done || function () {};
        action = action || function () {};

        function next(skip) {
            if (skip || nodes.length === 0) { return done(); }
            walk(nodes.shift(), action, next);
        }

        action(el, next);
    }

    var tagRE = /\{\{((?:.|\n)+?)\}\}/g;

    var parse = {
        text: function text(text$1) {
            // reference: https://github.com/vuejs/vue/blob/dev/src/compiler/parser/text-parser.js#L15-L41
            if (!tagRE.test(text$1)) { return JSON.stringify(text$1); }

            var tokens = [];
            var lastIndex = tagRE.lastIndex = 0;
            var index, matched;

            while (matched = tagRE.exec(text$1)) {
                index = matched.index;
                if (index > lastIndex) {
                    tokens.push(JSON.stringify(text$1.slice(lastIndex, index)));
                }
                tokens.push(matched[1].trim());
                lastIndex = index + matched[0].length;
            }

            if (lastIndex < text$1.length) { tokens.push(JSON.stringify(text$1.slice(lastIndex))); }

            return tokens.join('+');
        },
    };

    /**
     * Converts a string into a DOM element
     *
     * @param {String} DOMString
     * @return {DOM}
     */
    function domify(DOMString) {
        var html = document.implementation.createHTMLDocument();

        html.body.innerHTML = DOMString;

        return html.body.children;
    }

    var defaults = {
        template: "",
        data: {},
    };

    function each(items, callback) {
        var len, i = 0;

    	if (Array.isArray(items)) {
    		len = items.length;
    		for ( ; i < len; i++ ) {
    			if (callback.call(items[i], items[i], i) === false) { return items; }
    		}
    	} else {
    		for ( i in items ) {
                if (callback.call(items[i], items[i], i) === false) { return items; }
    		}
    	}

    	return items;
    }

    function type(object) {
        var class2type = {};
        var type = class2type.toString.call(object);
        var typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol';

        if (object == null) { return ("" + object); }

        typeString.split(' ').forEach(function (type) { return class2type[("[object " + type + "]")] = type.toLowerCase(); });

        return (
            typeof object === 'object' ||
            typeof object === 'function'
            ?
            class2type[type] || 'object'
            :
            typeof object
        );
    }

    function isPlainObject(object) {
        var class2type = {};
        var toString = class2type.toString;
        var hasOwn = class2type.hasOwnProperty;
        var fnToString = hasOwn.toString;
        var ObjectFunctionString = fnToString.call(Object);

        var prototype, ctor;

        if (!object || toString.call(object) !== '[object Object]') { return false; }

        prototype = Object.getPrototypeOf(object);

        if (!prototype) { return true; }

        ctor = hasOwn.call(prototype, 'constructor') && prototype.constructor;

        return typeof ctor === 'function' && fnToString.call( ctor ) === ObjectFunctionString;
    }

    /**
     * Extend object
     *
     * @method extend
     * @return {Object} object
     */
    function extend() {
        var arguments$1 = arguments;

        var options, name, clone, copy, source, copyIsArray,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }

        if (typeof target !== 'object' && type(target) !== 'function') {
            target = {};
        }

        if (i === length) {
            target = this;
            i--;
        }

        for (; i < length; i++) {
            //
            if ((options = arguments$1[i]) !== null) {
                // for in source object
                for (name in options) {

                    source = target[name];
                    copy = options[name];

                    if (target == copy) {
                        continue;
                    }

                    // deep clone
                    if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        // if copy is array
                        if (copyIsArray) {
                            copyIsArray = false;
                            // if is not array, set it to array
                            clone = source && Array.isArray(source) ? source : [];
                        } else {
                            // if copy is not a object, set it to object
                            clone = source && isPlainObject(source) ? source : {};
                        }

                        target[name] = extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }

        return target;
    }

    var configure = {
        identifier: {
            bind: ":",
        },
        priority: [
            'each' ],
    };

    var IF = {
        beforeUpdate: function beforeUpdate() {
            this.holder = document.createComment(("" + (configure.identifier.bind) + (this.name)));
            this.node.parentNode.replaceChild(this.holder, this.node);
        },
        update: function update(show) {
            if (show) { this.holder.parentNode.replaceChild(this.node, this.holder); }
        },
    };

    var src = {
        update: function update(src) {
            this.node.setAttribute(this.name, src);
        },
    };

    var show = {
        update: function update(show) {
            this.node.style.display = show ? "block" : "none";
        },
    };

    var text = {
        update: function update(value) {
            this.node.textContent = value;
        },
    };

    var each$1 = {
        beforeUpdate: function beforeUpdate() {
            this.holder = document.createComment(("" + (configure.identifier.bind) + (this.name)));
            this.node.parentNode.replaceChild(this.holder, this.node);

            // parse alias
            this.itemName = "item";
            this.indexName = "index";
            this.dataName = this.expression;

            if (this.expression.indexOf(' in ') != -1) {
                var bracketRE = /\(((?:.|\n)+?)\)/g;
                var ref = this.expression.split(' in ');
                var item = ref[0];
                var data = ref[1];
                var matched = bracketRE.exec(item);

                if (matched) {
                    var ref$1 = matched[1].split(',');
                    var item$1 = ref$1[0];
                    var index = ref$1[1];
                    index ? this.indexName = index.trim() : '';
                    this.itemName = item$1.trim();
                } else {
                    this.itemName = item.trim();
                }

                this.dataName = data.trim();
            }

            this.expression = this.dataName;
        },
        update: function update(data) {
            var this$1 = this;

            if (data && !Array.isArray(data)) { return false; }

            var fragment = document.createDocumentFragment();

            data.map(function (item, index) {
                var obj;

                var co = colon({
                    template: this$1.node.cloneNode(true),
                    data: ( obj = {}, obj[this$1.itemName] = item, obj[this$1.indexName] = index, obj ),
                });
                fragment.appendChild(co.options.template);
            });

            this.holder.parentNode.replaceChild(fragment, this.holder);
        },
    };

    var style = {
        update: function update(style) {
            var this$1 = this;

            each(style, function (item, i) {
                if (type(item) === 'object') {
                    each(item, function (value, key) { return this$1.node.style[key] = value; });
                } else {
                    this$1.node.style[i] = item;
                }
            });
        },
    };

    // reference: https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/class-util.js#L7-L26
    function addClass(el, cls) {
        if (!cls || !(cls = cls.trim())) { return; }

        if (el.classList) {
            if (cls.indexOf(' ') > -1) {
                cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
            } else {
                el.classList.add(cls);
            }
        } else {
            var current = " " + (el.getAttribute('class') || '') + " ";
            if (current.indexOf((" " + cls + " ")) < 0) {
                el.setAttribute('class', (current + cls).trim());
            }
        }
    }

    // reference: https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/class-util.js#L32-L61
    function removeClass(el, cls) {
        if (!cls || !(cls = cls.trim())) { return; }

        if (el.classList) {
            if (cls.indexOf(' ') > -1) {
                cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
            } else {
                el.classList.remove(cls);
            }
            if (!el.classList.length) { el.removeAttribute('class'); }
        } else {
            var cur = " " + (el.getAttribute('class') || '') + " ";
            var tar = " " + cls + " ";
            while (cur.indexOf(tar) >= 0) {
                cur = cur.replace(tar, ' ');
            }
            cur = cur.trim();
            cur ? el.setAttribute('class', cur) : el.removeAttribute('class');
        }
    }

    var clus = {
        update: function update(clus) {
            var this$1 = this;

            each(clus, function (item, i) {
                if (type(item) === 'object') {
                    each(item, function (value, key) { return value ? addClass(this$1.node, key) : removeClass(this$1.node, key); });
                } else {
                    var className = type(i) === 'number' ? item : i;
                    item ? addClass(this$1.node, className) : removeClass(this$1.node, className);
                }
            });
        },
    };

    var attribute = {
        update: function update(value) {
            this.node.setAttribute(this.attrName, value);
        },
    };

    var directives = {
        IF: IF,
        src: src,
        show: show,
        text: text,
        each: each$1,
        style: style,
        clus: clus,
        attribute: attribute,
    };

    var dependencyRE = /"[^"]*"|'[^']*'|\.\w*[a-zA-Z$_]\w*|\w*[a-zA-Z$_]\w*:|(\w*[a-zA-Z$_]\w*)/g;
    var globals = [
        'true', 'false', 'undefined', 'null', 'NaN', 'isNaN', 'typeof', 'in',
        'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'unescape',
        'escape', 'eval', 'isFinite', 'Number', 'String', 'parseFloat', 'parseInt' ];

    function generate(expression) {
        var dependencies = extractDependencies(expression);
        var dependenciesCode = dependencies.reduce(function (prev, current) {
            prev += "var " + current + " = data[\"" + current + "\"]; ";
            return prev;
        }, '');

        return new Function("data", (dependenciesCode + "return " + expression + ";"));
    }

    function extractDependencies(expression) {
        var dependencies = [];

        expression.replace(dependencyRE, function (match, dependency) {
            var isDefined = function (dependency) { return dependency !== undefined; };
            var hasDependency = function (dependencies, dependency) { return dependencies.includes(dependency); };
            var hasGlobal = function (globals, dependency) { return globals.includes(dependency); };

            if (isDefined(dependency) && !hasDependency(dependencies, dependency) && !hasGlobal(globals, dependency)) {
                dependencies.push(dependency);
            }
        });

        return dependencies;
    }

    var Directive = function Directive(options) {
        if ( options === void 0 ) options = {};

        if (options.name === 'if') { options.name = "IF"; }
        if (options.name === 'class') { options.name = "clus"; }

        Object.assign(this, options);
        Object.assign(this, directives[this.name]);

        this.beforeUpdate && this.beforeUpdate();
        this.update && this.update(generate(this.expression)(this.compile.data));
    };

    var hasInterpolation = function (text) { return /\{?\{\{(.+?)\}\}\}?/g.test(text); };

    function Compile(template, options) {
        var this$1 = this;
        var assign;

        if ( options === void 0 ) options = {};
        if (!(this instanceof Compile)) { return new Compile(template, options); }

        if (template instanceof Node) {
            options.template = template;
        } else if (typeof template === 'string') {
            (assign = domify(template), template = assign[0]);
            options.template = template;
        } else if (typeof template !== 'string') {
            options = template;
        }

        this.options = extend(true, defaults, options);
        this.data = this.options.data;
        template = this.options.template;

        walk(template, function (node, next) {
            if (node.nodeType === 1) {
                var skip = this$1.compile.elementNodes.call(this$1, node);
                return next(skip === false);
            } else if (node.nodeType === 3) {
                this$1.compile.textNodes.call(this$1, node);
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
        var this$1 = this;

        if (node.hasAttributes() && this.bindPriority(node)) { return false; }

        var attributes = [].slice.call(node.attributes);

        attributes.map(function (attribute) {
            var attributeName = attribute.name;
            var attributeValue = attribute.value.trim();

            if (attributeName.indexOf(configure.identifier.bind) === 0 && attributeValue !== '') {
                var directiveName = attributeName.slice(configure.identifier.bind.length);

                this$1.bindDirective({
                    node: node,
                    expression: attributeValue,
                    name: directiveName,
                });
                node.removeAttribute(attributeName);
            } else {
                this$1.bindAttribute(node, attribute);
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
        if (node.textContent.trim() === '') { return false; }

        this.bindDirective({
            node: node,
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
        if (!hasInterpolation(attribute.value) || attribute.value.trim() == '') { return false; }

        this.bindDirective({
            node: node,
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
        for (var i = 0; i < configure.priority.length; i++) {
            var directive = configure.priority[i];
            var attributeValue = node.getAttribute(("" + (configure.identifier.bind) + directive));

            if (attributeValue) {
                attributeValue = attributeValue.trim();
                if (!attributeValue) { return false; }

                node.removeAttribute(("" + (configure.identifier.bind) + directive));
                this.bindDirective({
                    node: node,
                    name: directive,
                    expression: attributeValue,
                });

                return true;
            } else {
                return false;
            }
        }
    };

    function initCompile(co) {
        co.view = Compile(co.options.template, {
            data: co.options.data,
        }).view;
    }

    function initComputed(co) {
        var computed = co.options.computed;

        if (!computed) { return false; }

        for (var key in computed) {
            var value = computed[key];

            if (typeof value === 'function') {
                Object.defineProperty(co.options.data, key, {
                    get: value,
                    enumerable: true,
                    configurable: true,
                });
            }
        }
    }

    function init(co) {
        initComputed(co);
        initCompile(co);
    }

    function colon(options) {
        if (!(this instanceof colon)) { return new colon(options); }

        this.options = options;
        init(this);
    }

    return colon;

}));
//# sourceMappingURL=colon.js.map
