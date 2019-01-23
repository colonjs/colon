export default function initComputed(co) {
    const computed = co.options.computed;

    if (!computed) return false;

    for (let key in computed) {
        const value = computed[key];

        if (typeof value === 'function') {
            Object.defineProperty(co.options.data, key, {
                get: value,
                enumerable: true,
                configurable: true,
            });
        }
    }
}
