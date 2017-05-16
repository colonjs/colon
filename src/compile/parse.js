const tagRE = /\{?\{\{(.+?)\}\}\}?/g;

export default {
    text(text) {
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
                needCompute: true,
                value,
            });
            nextIndex = index + matched[0].length;
        }

        if (nextIndex < text.length - 1) {
            segments.push({
                value: text.slice(nextIndex),
            });
        }

        const expression = segments.map(segment => {
            if (segment.value.trim() == '' || !segment.needCompute) segment.value = `"${segment.value}"`;
            if (segment.needCompute) segment.value = `colon.get("${segment.value}")`;
            return segment.value;
        }).join('+');

        return expression;
    },
};
