import { format, each, type } from '../common/utils';

export default {
    update(style) {
        each(style, (item, i) => {
            if (type(item) === 'object') {
                each(item, (value, key) => this.node.style[format(key)] = value);
            } else {
                this.node.style[format(i)] = item;
            }
        });
    },
};
