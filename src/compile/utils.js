export const hasInterpolation = text => /\{?\{\{(.+?)\}\}\}?/g.test(text);
