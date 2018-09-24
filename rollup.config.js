import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import sourcemaps from 'rollup-plugin-sourcemaps';

const packages = require('./package.json');
const paths = {
    root: '/',
    source: {
        root: './src/',
    },
    dist: {
        root: './dist/',
    },
};

const banner = `
/*!
* ${packages.name}.js v${packages.version}
* (c) 2017 ${packages.author}
* ${packages.repository.url.replace('.git', '')}
* Released under the MIT License.
*/
`;

const fileName = (process.env.NODE_ENV === 'development' ? packages.name : `${packages.name}.min`).toLowerCase();

const configure = {
    input: `${paths.source.root}index.js`,
    output: [{
        banner,
        format: 'umd',
        file: `${paths.dist.root}${fileName}.js`,
        name: packages.moduleName,
        sourcemap: true,
    }],
    plugins: [
        babel(),
        sourcemaps(),
    ],
};

if (process.env.NODE_ENV === 'production') configure.plugins.push(uglify());

export default configure;
