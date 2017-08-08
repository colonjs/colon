import configure from '../configure';

export default {
    beforeUpdate() {
        this.holder = document.createComment(`${configure.identifier.bind}${this.name}`);
        this.node.parentNode.replaceChild(this.holder, this.node);
    },
    update(show) {
        if (show) this.holder.parentNode.replaceChild(this.node, this.holder);
    },
};
