import Compile from '../compile/index';

export default function initCompile(co) {
    co.$Compile = Compile;

    co.view = co.$Compile(co.options.template, {
        data: co.options.data,
    }).view;
}
