const tagRE = /\{\{((?:.|\n)+?)\}\}/g;

export default {
    text(text) {
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
