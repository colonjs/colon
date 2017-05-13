import Compile from '../compile/index';

export default function initCompile(co) {
    co.$Compile = Compile;

    co.$Compile(co.options.template, {
        data: co.data,
        co,
    });
}
