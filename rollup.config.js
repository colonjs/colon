import buble from 'rollup-plugin-buble';
import alias from 'rollup-plugin-alias';
import minify from 'rollup-plugin-babel-minify';
import resolve from 'rollup-plugin-node-resolve';

const isProd = process.env.NODE_ENV === 'production';
const { moduleName, name: fileName, version, author, repository } = require('./package.json');
const getFilePath = (type = '') => `dist/${fileName}${type == '' ? '' : '.'}${type}.js`;
const output = options => ({
    banner,
    name: moduleName,
    sourcemap: true,
    ...options,
});

const banner = `
/*!
* ${fileName}.js v${version}
* (c) 2017 ${ author }
* ${repository.url.replace('.git', '')}
* Released under the MIT License.
*/
`;

const configure = {
    input: 'src/index.js',
    output: [output({
        file: getFilePath(),
        format: 'umd',
    }), output({
        file: getFilePath('es'),
        format: 'es',
    })],
    plugins: [
        alias({
            init: './init/index',
        }),
        buble(),
        resolve(),
    ],
    external: [],
};

if (isProd) {
    configure.output = configure.output.map(output => {
        const format = output.format == 'umd' ? '' : `.${output.format}`;
        output.file = `dist/${fileName}${format}.min.js`;
        return output;
    });
    configure.plugins.push(minify());
}

module.exports = configure;