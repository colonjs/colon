import configure from '../configure';
import colon from '../index';

export default {
    bind() {
        this.holder = document.createComment(`${configure.identifier.bind}${this.name}`);
        this.node.parentNode.replaceChild(this.holder, this.node);

        // parse alias
        this.itemName = `item`;
        this.indexName = `index`;
        this.dataName = this.expression;

        if (this.expression.indexOf(' in ') != -1) {
            const bracketRE = /\(((?:.|\n)+?)\)/g;
            const [item, data] = this.expression.split(' in ');
            let matched = null;

            if (matched = bracketRE.exec(item)) {
                const [item, index] = matched[1].split(',');
                index ? this.indexName = index.trim() : '';
                this.itemName = item.trim();
            } else {
                this.itemName = item.trim();
            }

            this.dataName = data.trim();
        }

        this.expression = this.dataName;
    },
    update(data) {
        if (data && !Array.isArray(data)) return;

        const fragment = document.createDocumentFragment();

        data.map((item, index) => {
            const co = colon({
                template: this.node.cloneNode(true),
                data: {
                    [this.itemName]: item,
                    [this.indexName]: index,
                },
            });
            fragment.appendChild(co.options.template);
        });

        this.holder.parentNode.replaceChild(fragment, this.holder);
    },
};
