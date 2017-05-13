import init from './init/index';

export default function colon(options) {
    if (!(this instanceof colon)) return new colon(options);

    this.options = options;
    init(this);
}
