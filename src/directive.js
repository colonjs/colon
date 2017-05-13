import directives from './directives/index';

export default class Directive {
    constructor(options = {}) {
        Object.assign(this, options);
        Object.assign(this, directives[this.name]);
        this.bindData();
    }

    bindData() {
        if (!this.expression) return;
        this.bind && this.bind();
        this.update && this.update(this.getData());
    }

    getData() {
        let expressions = this.expression.split('.'),
            data = this.data;

        if (this.expression === `true`) return true;
        if (this.expression === `false`) return false;

        expressions.map(expression => {
            data = data[expression];
        });

        return data;
    }
}
