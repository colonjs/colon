const tagRE = /\{?\{\{(.+?)\}\}\}?/g;

export default {
    text(text) {
        if (text.trim() == '' || !tagRE.test(text)) return [];

        let segments = [],
            value,
            index,
            matched,
            nextIndex = 0;

        tagRE.lastIndex = 0;

        while (matched = tagRE.exec(text)) {
            index = matched.index;
            if (index > nextIndex) {
                segments.push({
                    value: text.slice(nextIndex, index),
                });
            }
            value = matched[1].trim();
            segments.push({
                isDirective: true,
                value,
            });
            nextIndex = index + matched[0].length;
        }

        if (nextIndex < text.length - 1) {
            segments.push({
                value: text.slice(nextIndex),
            });
        }

        return segments;
    },
};
