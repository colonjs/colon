import initConstruct from './construct';
import initComplie from './compile';

export default function init(co) {
    initComplie(co);
    initConstruct(co);
}
