const tagRE = /\{\{((?:.|\n)+?)\}\}/g;

export default {
    text(text) {
        // reference: https://github.com/vuejs/vue/blob/dev/src/compiler/parser/text-parser.js#L15-L41
        if (!tagRE.test(text)) return JSON.stringify(text);

        const tokens = [];
        let lastIndex = tagRE.lastIndex = 0;
        let index, matched;

        while (matched = tagRE.exec(text)) {
            index = matched.index;
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
            tokens.push(matched[1].trim());
            lastIndex = index + matched[0].length;
        }

        if (lastIndex < text.length) tokens.push(JSON.stringify(text.slice(lastIndex)));

        return tokens.join('+');
    },
};
