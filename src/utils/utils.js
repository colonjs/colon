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
