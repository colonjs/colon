import initCompile from './compile';
import initComputed from './computed';

export default function init(co) {
    initComputed(co);
    initCompile(co);
}
