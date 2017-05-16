import directives from './directives/index';
import { buildCompute } from './utils/utils';

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
        this.update && this.update(buildCompute(this.expression)(this.co));
    }
}
