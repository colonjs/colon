export default function initConstruct(co) {
    co.data = co.options.data || {};

    co.get = function (expression) {
        if (expression.trim() === '') return '';

        let expressions = expression.split('.'),
            data = this.data;

        if (expression === `true`) return true;
        if (expression === `false`) return false;

        expressions.map(expression => {
            data = data && data[expression];
        });

        return data;
    };
}
