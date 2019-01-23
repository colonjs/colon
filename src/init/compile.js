import Compile from '../compile/index';

export default function initCompile(co) {
    co.view = Compile(co.options.template, {
        data: co.options.data,
    }).view;
}
