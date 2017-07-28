export default function initConstruct(co) {
    co.data = co.options.data || {};

    co.get = function (expression) {
        if (expression.trim() === '') return '';

        let expressions = expression.split('.'),
            data = this.data;

        expressions.map(expression => {
            data = data && data[expression];
        });

        return data;
    };
}
