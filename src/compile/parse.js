import { separateVariable } from './utils';

const tagRE = /\{\{((?:.|\n)+?)\}\}/g;

export default {
    text(text) {
        if (!tagRE.test(text)) return text;

        let segments = [],
            value,
            index,
            matched,
            nextIndex = 0;

        tagRE.lastIndex = 0;

        while (matched = tagRE.exec(text)) {
            index = matched.index;
            if (index > nextIndex) segments.push(`"${text.slice(nextIndex, index)}"`);
            value = matched[1].trim();
            separateVariable(value).map(val => segments.push(`colon.get('${val}')`));
            nextIndex = index + matched[0].length;
        }

        if (nextIndex < text.length - 1) segments.push(text.slice(nextIndex));

        return segments.join('+');
    },
    expression(expression) {
        if (expression == 'true') return 'true';
        if (expression == 'false') return 'false';

        let segments = [];

        separateVariable(expression).map(variable => segments.push(`colon.get('${variable}')`));

        return segments.join('+');
    },
};
