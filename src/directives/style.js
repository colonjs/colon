import { each, type } from '../common/utils';

export default {
    update(style) {
        each(style, (item, i) => {
            if (type(item) === 'object') {
                each(item, (value, key) => this.node.style[key] = value);
            } else {
                this.node.style[i] = item;
            }
        });
    },
};
