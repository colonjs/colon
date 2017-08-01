export function format(name, separator) {
    const RE = /([a-z]|(?:[A-Z0-9]+))([A-Z0-9]|$)/g;

    return name.replace(RE, (_, $1, $2) => $1 + ($2 && (separator || '-') + $2)).toLowerCase();
}

export function each(items, callback) {
    let len, i = 0;

	if (Array.isArray(items)) {
		len = items.length;
		for ( ; i < len; i++ ) {
			if (callback.call(items[i], items[i], i) === false) return items;
		}
	} else {
		for ( i in items ) {
            if (callback.call(items[i], items[i], i) === false) return items;
		}
	}

	return items;
}

export function type(object) {
    const class2type = {};
    const type = class2type.toString.call(object);
    const typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol';

    if (object == null) return `${object}`;

    typeString.split(' ').forEach(type => class2type[`[object ${type}]`] = type.toLowerCase());

    return (
        typeof object === 'object' ||
        typeof object === 'function'
        ?
        class2type[type] || 'object'
        :
        typeof object
    );
}

export function isPlainObject(object) {
    const class2type = {};
    const toString = class2type.toString;
    const hasOwn = class2type.hasOwnProperty;
    const fnToString = hasOwn.toString;
    const ObjectFunctionString = fnToString.call(Object);

    let prototype, ctor;

    if (!object || toString.call(object) !== '[object Object]') return false;

    prototype = Object.getPrototypeOf(object);

    if (!prototype) return true;

    ctor = hasOwn.call(prototype, 'constructor') && prototype.constructor;

    return typeof ctor === 'function' && fnToString.call( ctor ) === ObjectFunctionString;
}
