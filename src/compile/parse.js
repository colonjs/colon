const tagRE = /\{\{((?:.|\n)+?)\}\}/g;

export default {
    text(text) {
        if (!tagRE.test(text)) return text;

        let segments = [],
            expression,
            index,
            matched,
            nextIndex = 0;

        tagRE.lastIndex = 0;

        while (matched = tagRE.exec(text)) {
            index = matched.index;
            if (index > nextIndex) segments.push(`"${text.slice(nextIndex, index)}"`);
            expression = matched[1].trim();
            segments.push(expression);
            nextIndex = index + matched[0].length;
        }

        if (nextIndex < text.length - 1) segments.push(text.slice(nextIndex));

        return segments.join('+');
    },
};
