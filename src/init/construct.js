export default function initConstruct(co) {
    co.data = co.options.data || {};
    co.$Compile(co.options.template, {
        data: co.options.data,
        co,
    });
}
