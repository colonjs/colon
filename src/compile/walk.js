/**
 * walk dom element
 *
 * @param {DOM}   el
 * @param {Function}   action
 * @param {Function} done
 */
export default function walk(el, action, done) {
    const nodes = el.childNodes && [].slice.call(el.childNodes);

    done = done || function () {};
    action = action || function () {};

    function next(skip) {
        if (skip || nodes.length === 0) return done();
        walk(nodes.shift(), action, next);
    }

    action(el, next);
}
