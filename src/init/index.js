import initConstruct from './construct';
import initCompile from './compile';
import initComputed from './computed';

export default function init(co) {
    initConstruct(co);
    initComputed(co);
    initCompile(co);
}
