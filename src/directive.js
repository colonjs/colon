import directives from './directives/index';
import generate from './compile/generate';

export default class Directive {
    constructor(options = {}) {
        if (options.name === 'if') options.name = `IF`;
        if (options.name === 'class') options.name = `clus`;

        Object.assign(this, options);
        Object.assign(this, directives[this.name]);

        this.beforeUpdate && this.beforeUpdate();
        this.update && this.update(generate(this.expression)(this.compile.data));
    }
}
