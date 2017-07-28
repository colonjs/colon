const expressionRE = /"[^"]*"|'[^']*'|\.\w*[a-zA-Z$_]\w*|\w*[a-zA-Z$_]\w*:|(\w*[a-zA-Z$_]\w*)/g;
const globals = ['true', 'false', 'undefined', 'null', 'NaN', 'typeof', 'in'];

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

    expression.replace(expressionRE, function(match, reference) {
        if(
            reference !== undefined &&
            dependencies.indexOf(reference) === -1 &&
            globals.indexOf(reference) === -1
        ) {
            dependencies.push(reference);
        }
    });

    return dependencies;
}
