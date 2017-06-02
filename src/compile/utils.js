
export function hasInterpolation(text) {
    const tagRE = /\{?\{\{(.+?)\}\}\}?/g;
    return tagRE.test(text);
}

export function separateVariable(text) {
    return text.replace(/\w+ *\(|"[^"]*"|'[^']*'|\/([^/]+)\//g, '').match(/[a-zA-Z_]\w*([.][a-zA-Z_]\w*)*/g) || [];
}
