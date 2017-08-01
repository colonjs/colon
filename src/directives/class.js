import { each, type } from '../common/utils';
import { addClass, removeClass } from '../common/dom';

export default {
    update(clus) {
        each(clus, (item, i) => {
            if (type(item) === 'object') {
                each(item, (value, key) => value ? addClass(this.node, key) : removeClass(this.node, key));
            } else {
                const className = type(i) === 'number' ? item : i;
                item ? addClass(this.node, className) : removeClass(this.node, className);
            }
        });
    },
};
