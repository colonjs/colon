const expressionRE = /"[^"]*"|'[^']*'|\.\w*[a-zA-Z$_]\w*|\w*[a-zA-Z$_]\w*:|(\w*[a-zA-Z$_]\w*)/g;
const globals = ['true', 'false', 'undefined', 'null', 'NaN', 'typeof', 'in'];

export function generate(expression) {
    let dependenciesCode = '';
    const dependencies = extractDependencies(expression);

	for(let i = 0; i < dependencies.length; i++) {
        const dependency = dependencies[i];
        dependenciesCode += `var ${dependency} = colon.get("${dependency}"); `;
	}

    const code = `${dependenciesCode}return ${expression};`;
    return new Function('colon', code);
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
