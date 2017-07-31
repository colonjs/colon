/**
 * Converts a string into a DOM element
 *
 * @param {String} DOMString
 * @return {DOM}
 */
export default function domify(DOMString) {
    const html = document.implementation.createHTMLDocument();

    html.body.innerHTML = DOMString;

    return html.body.children;
}
