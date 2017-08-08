export default function initComputed(co) {
    const computed = co.options.computed;

    if (!computed) return;

    let descriptor, prop;

    for (prop in computed) {
        descriptor = computed[prop];

        if (typeof descriptor === 'function') {
            descriptor = {
                get: descriptor,
            };

            descriptor.enumerable = true;
            descriptor.configurable = true;

            Object.defineProperty(co.options.data, prop, descriptor);
        }
    }
}
