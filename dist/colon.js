(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define('colon', factory) :
	(global.colon = factory());
}(this, (function () { 'use strict';

function initConstruct(co) {
  co.data = co.options.data || {};

  /**
   * Gets Value in Data
   * @param {String} key
   * @return {String} Value of key in data
   */
  co.get = function (key) {
    return co.data[key];
  };
}

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
        if (skip || nodes.length === 0) return done();
        walk(nodes.shift(), action, next);
    }

    action(el, next);
}

var tagRE = /\{\{((?:.|\n)+?)\}\}/g;

var parse = {
    text: function text(_text) {
        // reference: https://github.com/vuejs/vue/blob/dev/src/compiler/parser/text-parser.js#L15-L41
        if (!tagRE.test(_text)) return JSON.stringify(_text);

        var tokens = [];
        var lastIndex = tagRE.lastIndex = 0;
        var index = void 0,
            matched = void 0;

        while (matched = tagRE.exec(_text)) {
            index = matched.index;
            if (index > lastIndex) {
                tokens.push(JSON.stringify(_text.slice(lastIndex, index)));
            }
            tokens.push(matched[1].trim());
            lastIndex = index + matched[0].length;
        }

        if (lastIndex < _text.length) tokens.push(JSON.stringify(_text.slice(lastIndex)));

        return tokens.join('+');
    }
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
    data: {}
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };



function each(items, callback) {
    var len = void 0,
        i = 0;

    if (Array.isArray(items)) {
        len = items.length;
        for (; i < len; i++) {
            if (callback.call(items[i], items[i], i) === false) return items;
        }
    } else {
        for (i in items) {
            if (callback.call(items[i], items[i], i) === false) return items;
        }
    }

    return items;
}

function type(object) {
    var class2type = {};
    var type = class2type.toString.call(object);
    var typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol';

    if (object == null) return '' + object;

    typeString.split(' ').forEach(function (type) {
        return class2type['[object ' + type + ']'] = type.toLowerCase();
    });

    return (typeof object === 'undefined' ? 'undefined' : _typeof$1(object)) === 'object' || typeof object === 'function' ? class2type[type] || 'object' : typeof object === 'undefined' ? 'undefined' : _typeof$1(object);
}

function isPlainObject(object) {
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var fnToString = hasOwn.toString;
    var ObjectFunctionString = fnToString.call(Object);

    var prototype = void 0,
        ctor = void 0;

    if (!object || toString.call(object) !== '[object Object]') return false;

    prototype = Object.getPrototypeOf(object);

    if (!prototype) return true;

    ctor = hasOwn.call(prototype, 'constructor') && prototype.constructor;

    return typeof ctor === 'function' && fnToString.call(ctor) === ObjectFunctionString;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Extend object
 *
 * @method extend
 * @return {Object} object
 */
function extend() {
    var options = void 0,
        name = void 0,
        clone = void 0,
        copy = void 0,
        source = void 0,
        copyIsArray = void 0,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    if (typeof target === 'boolean') {
        deep = target;
        target = arguments[i] || {};
        i++;
    }

    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object' && type(target) !== 'function') {
        target = {};
    }

    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {
        //
        if ((options = arguments[i]) !== null) {
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
        bind: ':'
    },
    priority: ['each']
};

var IF = {
    bind: function bind() {
        this.holder = document.createComment('' + configure.identifier.bind + this.name);
        this.node.parentNode.replaceChild(this.holder, this.node);
    },
    update: function update(show) {
        if (show) this.holder.parentNode.replaceChild(this.node, this.holder);
    }
};

var src = {
    update: function update(src) {
        this.node.setAttribute(this.name, src);
    }
};

var show = {
    update: function update(show) {
        this.node.style.display = show ? "block" : "none";
    }
};

var text = {
    update: function update(value) {
        this.node.textContent = value;
    }
};

var _slicedToArray$1 = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var each$1 = {
    bind: function bind() {
        this.holder = document.createComment('' + configure.identifier.bind + this.name);
        this.node.parentNode.replaceChild(this.holder, this.node);

        // parse alias
        this.itemName = 'item';
        this.indexName = 'index';
        this.dataName = this.expression;

        if (this.expression.indexOf(' in ') != -1) {
            var bracketRE = /\(((?:.|\n)+?)\)/g;

            var _expression$split = this.expression.split(' in '),
                _expression$split2 = _slicedToArray$1(_expression$split, 2),
                item = _expression$split2[0],
                data = _expression$split2[1];

            var matched = null;

            if (matched = bracketRE.exec(item)) {
                var _matched$1$split = matched[1].split(','),
                    _matched$1$split2 = _slicedToArray$1(_matched$1$split, 2),
                    _item = _matched$1$split2[0],
                    index = _matched$1$split2[1];

                index ? this.indexName = index.trim() : '';
                this.itemName = _item.trim();
            } else {
                this.itemName = item.trim();
            }

            this.dataName = data.trim();
        }

        this.expression = this.dataName;
    },
    update: function update(data) {
        var _this = this;

        if (data && !Array.isArray(data)) return;

        var fragment = document.createDocumentFragment();

        data.map(function (item, index) {
            var _data;

            var co = colon({
                template: _this.node.cloneNode(true),
                data: (_data = {}, _defineProperty(_data, _this.itemName, item), _defineProperty(_data, _this.indexName, index), _data)
            });
            fragment.appendChild(co.options.template);
        });

        this.holder.parentNode.replaceChild(fragment, this.holder);
    }
};

var style = {
    update: function update(style) {
        var _this = this;

        each(style, function (item, i) {
            if (type(item) === 'object') {
                each(item, function (value, key) {
                    return _this.node.style[key] = value;
                });
            } else {
                _this.node.style[i] = item;
            }
        });
    }
};

// reference: https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/class-util.js#L7-L26
function addClass(el, cls) {
    if (!cls || !(cls = cls.trim())) return;

    if (el.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(function (c) {
                return el.classList.add(c);
            });
        } else {
            el.classList.add(cls);
        }
    } else {
        var current = ' ' + (el.getAttribute('class') || '') + ' ';
        if (current.indexOf(' ' + cls + ' ') < 0) {
            el.setAttribute('class', (current + cls).trim());
        }
    }
}

// reference: https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/class-util.js#L32-L61
function removeClass(el, cls) {
    if (!cls || !(cls = cls.trim())) return;

    if (el.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(function (c) {
                return el.classList.remove(c);
            });
        } else {
            el.classList.remove(cls);
        }
        if (!el.classList.length) el.removeAttribute('class');
    } else {
        var cur = ' ' + (el.getAttribute('class') || '') + ' ';
        var tar = ' ' + cls + ' ';
        while (cur.indexOf(tar) >= 0) {
            cur = cur.replace(tar, ' ');
        }
        cur = cur.trim();
        cur ? el.setAttribute('class', cur) : el.removeAttribute('class');
    }
}

var clus = {
    update: function update(clus) {
        var _this = this;

        each(clus, function (item, i) {
            if (type(item) === 'object') {
                each(item, function (value, key) {
                    return value ? addClass(_this.node, key) : removeClass(_this.node, key);
                });
            } else {
                var className = type(i) === 'number' ? item : i;
                item ? addClass(_this.node, className) : removeClass(_this.node, className);
            }
        });
    }
};

var attribute = {
    update: function update(value) {
        this.node.setAttribute(this.attrName, value);
    }
};

var directives = {
    IF: IF,
    src: src,
    show: show,
    text: text,
    each: each$1,
    style: style,
    clus: clus,
    attribute: attribute
};

var dependencyRE = /"[^"]*"|'[^']*'|\.\w*[a-zA-Z$_]\w*|\w*[a-zA-Z$_]\w*:|(\w*[a-zA-Z$_]\w*)/g;
var globals = ['true', 'false', 'undefined', 'null', 'NaN', 'isNaN', 'typeof', 'in', 'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'unescape', 'escape', 'eval', 'isFinite', 'Number', 'String', 'parseFloat', 'parseInt'];

function generate(expression) {
    var dependencies = extractDependencies(expression);
    var dependenciesCode = '';

    dependencies.map(function (dependency) {
        return dependenciesCode += 'var ' + dependency + ' = this.get("' + dependency + '"); ';
    });

    return new Function(dependenciesCode + 'return ' + expression + ';');
}

function extractDependencies(expression) {
    var dependencies = [];

    expression.replace(dependencyRE, function (match, dependency) {
        if (dependency !== undefined && dependencies.indexOf(dependency) === -1 && globals.indexOf(dependency) === -1) {
            dependencies.push(dependency);
        }
    });

    return dependencies;
}

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Directive = function () {
    function Directive() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Directive);

        if (options.name === 'if') options.name = 'IF';
        if (options.name === 'class') options.name = 'clus';

        Object.assign(this, options);
        Object.assign(this, directives[this.name]);
        this.bindData();
    }

    _createClass(Directive, [{
        key: 'bindData',
        value: function bindData() {
            if (!this.expression) return;
            this.bind && this.bind();
            this.update && this.update(generate(this.expression).call(this.co));
        }
    }]);

    return Directive;
}();

var hasInterpolation = function hasInterpolation(text) {
  return (/\{?\{\{(.+?)\}\}\}?/g.test(text)
  );
};

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function Compile(template) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!(this instanceof Compile)) return new Compile(template, options);

    if (template instanceof Node) {
        options.template = template;
    } else if (typeof template === 'string') {
        var _domify = domify(template);

        var _domify2 = _slicedToArray(_domify, 1);

        template = _domify2[0];

        options.template = template;
    } else if (typeof template !== 'string') {
        options = template;
    }

    this.options = extend(true, defaults, options);
    this.co = this.options.co;
    template = this.options.template;

    walk(template, function (node, next) {
        if (node.nodeType === 1) {
            var skip = _this.compile.elementNodes.call(_this, node);
            return next(skip === false);
        } else if (node.nodeType === 3) {
            _this.compile.textNodes.call(_this, node);
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
    var _this2 = this;

    var attributes = [].slice.call(node.attributes),
        attrName = '',
        attrValue = '',
        directiveName = '';

    if (node.hasAttributes() && this.bindPriority(node)) return false;

    attributes.map(function (attribute) {
        attrName = attribute.name;
        attrValue = attribute.value.trim();

        if (attrName.indexOf(configure.identifier.bind) === 0 && attrValue !== '') {
            directiveName = attrName.slice(configure.identifier.bind.length);

            _this2.bindDirective({
                node: node,
                expression: attrValue,
                name: directiveName
            });
            node.removeAttribute(attrName);
        } else {
            _this2.bindAttribute(node, attribute);
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
    var el = document.createTextNode('');
    node.parentNode.insertBefore(el, node);
    this.bindDirective({
        node: el,
        name: 'text',
        expression: parse.text(node.textContent)
    });

    node.parentNode.removeChild(node);
};

/**
 * bind directive
 *
 * @param {Object} options - directive options
 */
Compile.prototype.bindDirective = function (options) {
    new Directive(_extends({}, options, {
        co: this.co
    }));
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
        node: node,
        name: 'attribute',
        expression: parse.text(attribute.value),
        attrName: attribute.name
    });
};

/**
 * bind priority directive.
 *
 * @param {Node} node
 * @return {Boolean}
 */
Compile.prototype.bindPriority = function (node) {
    var attrValue = void 0,
        directive = void 0;

    for (var i = 0; i < configure.priority.length; i++) {
        directive = configure.priority[i];
        attrValue = node.getAttribute('' + configure.identifier.bind + directive);

        if (attrValue) {
            attrValue = attrValue.trim();
            if (!attrValue) return false;

            node.removeAttribute('' + configure.identifier.bind + directive);
            this.bindDirective({
                node: node,
                name: directive,
                expression: attrValue
            });

            return true;
        } else {
            return false;
        }
    }
};

function initCompile(co) {
    co.$Compile = Compile;

    co.view = co.$Compile(co.options.template, {
        data: co.data,
        co: co
    }).view;
}

function initComputed(co) {
    var computed = co.options.computed;

    if (!computed) return;

    var descriptor = void 0,
        prop = void 0;

    for (prop in computed) {
        descriptor = computed[prop];

        if (typeof descriptor === 'function') {
            descriptor = {
                get: descriptor
            };

            descriptor.enumerable = true;
            descriptor.configurable = true;

            Object.defineProperty(co.data, prop, descriptor);
        }
    }
}

function init(co) {
    initConstruct(co);
    initComputed(co);
    initCompile(co);
}

function colon(options) {
    if (!(this instanceof colon)) return new colon(options);

    this.options = options;
    init(this);
}

return colon;

})));
//# sourceMappingURL=colon.js.map
