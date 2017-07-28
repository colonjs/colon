export default function initConstruct(co) {
    co.data = co.options.data || {};

    /**
     * Gets Value in Data
     * @param {String} key
     * @return {String} Value of key in data
     */
    co.get = key => co.data[key];
}
