export function buildCompute(expression) {
    return new Function('colon', `return ${expression};`);
}

export function type(object) {
    let class2type = {},
        type = class2type.toString.call(object),
        typeString = 'Boolean Number String Function Array Date RegExp Object Error Symbol';

    if (object == null) return `${object}`;

    typeString.split(' ').forEach((type) => {
        class2type[`[object ${type}]`] = type.toLowerCase();
    });

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
    let prototype,
        ctor,
        class2type = {},
        toString = class2type.toString,
        hasOwn = class2type.hasOwnProperty,
        fnToString = hasOwn.toString,
        ObjectFunctionString = fnToString.call( Object );

    if (!object || toString.call(object) !== '[object Object]') return false;

    prototype = Object.getPrototypeOf(object);

    if (!prototype) return true;

    ctor = hasOwn.call(prototype, 'constructor') && prototype.constructor;

    return typeof ctor === 'function' && fnToString.call( ctor ) === ObjectFunctionString;
}
