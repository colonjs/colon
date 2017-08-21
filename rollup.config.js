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

let fileName, configure;

fileName = process.env.NODE_ENV === 'development' ? packages.name : `${packages.name}.min`;

configure = {
    moduleName: 'colon',
    moduleId: 'colon',
    entry: `${paths.source.root}index.js`,
    sourceMap: true,
    banner: `
/*!
 * ${packages.name}.js v${packages.version}
 * (c) 2017 ${packages.author}
 * ${packages.repository.url.replace('.git', '')}
 * Released under the MIT License.
*/
    `,
    targets: [{
        dest: `${paths.dist.root}${fileName}.js`,
        format: 'umd',
    }],
    plugins: [
        babel(),
        sourcemaps(),
    ],
};

if (process.env.NODE_ENV === 'production') {
    configure.plugins.push(uglify());
} else {
    configure.targets.push({
        dest: `${paths.dist.root}${fileName}.es.js`,
        format: 'es',
    });
}

export default configure;
