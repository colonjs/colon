
export function hasInterpolation(text) {
    const tagRE = /\{?\{\{(.+?)\}\}\}?/g;
    return tagRE.test(text);
}
