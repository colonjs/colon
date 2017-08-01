export function addClass(el, cls) {
    if (!cls || !(cls = cls.trim())) return;

    if (el.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(c => el.classList.add(c));
        } else {
            el.classList.add(cls);
        }
    } else {
        const current = ` ${el.getAttribute('class') || ''} `;
        if (current.indexOf(` ${cls} `) < 0) {
            el.setAttribute('class', (current + cls).trim());
        }
    }
}

export function removeClass(el, cls) {
    if (!cls || !(cls = cls.trim())) return;

    if (el.classList) {
        if (cls.indexOf(' ') > -1) {
            cls.split(/\s+/).forEach(c => el.classList.remove(c));
        } else {
            el.classList.remove(cls);
        }
        if (!el.classList.length) el.removeAttribute('class');
    } else {
        let cur = ` ${el.getAttribute('class') || ''} `;
        const tar = ` ${cls} `;
        while (cur.indexOf(tar) >= 0) {
            cur = cur.replace(tar, ' ');
        }
        cur = cur.trim();
        cur ? el.setAttribute('class', cur) : el.removeAttribute('class');
    }
}
