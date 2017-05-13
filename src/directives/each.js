import configure from '../configure';

export default {
    bind() {
        this.holder = document.createComment(`${configure.identifier.bind}${this.name}`);
        this.node.parentNode.replaceChild(this.holder, this.node);
    },
    update(data) {
        if (data && !Array.isArray(data)) return;

        let fragment = document.createDocumentFragment();

        data.map((item, index) => {
            const co = this.co.$Compile({
                template: this.node.cloneNode(true),
                data: {
                    item,
                    index,
                },
            });
            fragment.appendChild(co.template);
        });

        this.holder.parentNode.replaceChild(fragment, this.holder);
    },
};
