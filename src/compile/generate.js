const expressionRE = /"[^"]*"|'[^']*'|\.\w*[a-zA-Z$_]\w*|\w*[a-zA-Z$_]\w*:|(\w*[a-zA-Z$_]\w*)/g;
const globals = [
    'true', 'false', 'undefined', 'null', 'NaN', 'isNaN', 'typeof', 'in',
    'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'unescape',
    'escape', 'eval', 'isFinite', 'Number', 'String', 'parseFloat', 'parseInt',
];

export function generate(expression) {
    const dependencies = extractDependencies(expression);
    let dependenciesCode = '';

	for(let i = 0; i < dependencies.length; i++) {
        const dependency = dependencies[i];
        dependenciesCode += `var ${dependency} = this.get("${dependency}"); `;
	}

    return new Function(`${dependenciesCode}return ${expression};`);
}

export function extractDependencies(expression) {
    const dependencies = [];

    expression.replace(expressionRE, (match, dependency) => {
        if(
            dependency !== undefined &&
            dependencies.indexOf(dependency) === -1 &&
            globals.indexOf(dependency) === -1
        ) {
            dependencies.push(dependency);
        }
    });

    return dependencies;
}
