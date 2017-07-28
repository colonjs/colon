import directives from './directives/index';
import { generate } from './compile/generate';

export default class Directive {
    constructor(options = {}) {
        if (options.name === 'if') options.name = `IF`;

        Object.assign(this, options);
        Object.assign(this, directives[this.name]);
        this.bindData();
    }

    bindData() {
        if (!this.expression) return;
        this.bind && this.bind();
        this.update && this.update(generate(this.expression).call(this.co));
    }
}
