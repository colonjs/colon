import { each, type } from '../common/utils';
import { addClass, removeClass } from '../common/dom';

export default {
    update(clus) {
        each(clus, (item, i) => {
            if (type(item) === 'object') {
                each(item, (value, key) => {
                    value ? addClass(this.node, key) : removeClass(this.node, key);
                });
            } else {
                item ? addClass(this.node, i) : removeClass(this.node, i);
            }
        });
    },
};
