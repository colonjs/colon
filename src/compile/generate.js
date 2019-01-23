const dependencyRE = /"[^"]*"|'[^']*'|\.\w*[a-zA-Z$_]\w*|\w*[a-zA-Z$_]\w*:|(\w*[a-zA-Z$_]\w*)/g;
const globals = [
    'true', 'false', 'undefined', 'null', 'NaN', 'isNaN', 'typeof', 'in',
    'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'unescape',
    'escape', 'eval', 'isFinite', 'Number', 'String', 'parseFloat', 'parseInt',
];

export default function generate(expression) {
    const dependencies = extractDependencies(expression);
    const dependenciesCode = dependencies.reduce((prev, current) => {
        prev += `var ${current} = data["${current}"]; `
        return prev;
    }, '');

    return new Function(`data`, `${dependenciesCode}return ${expression};`);
}

export function extractDependencies(expression) {
    const dependencies = [];

    expression.replace(dependencyRE, (match, dependency) => {
        const isDefined = dependency => dependency !== undefined;
        const hasDependency = (dependencies, dependency) => dependencies.includes(dependency);
        const hasGlobal = (globals, dependency) => globals.includes(dependency);

        if (isDefined(dependency) && !hasDependency(dependencies, dependency) && !hasGlobal(globals, dependency)) {
            dependencies.push(dependency);
        }
    });

    return dependencies;
}
