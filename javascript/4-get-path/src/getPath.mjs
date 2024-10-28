import { domEmulation } from './utils.mjs';

export function getPath(...args) {
    if (args.length < 1) {
        throw new Error('"element" argument must be specified');
    }

    if (args.length > 1) {
        throw new Error('getPath takes only "element" argument');
    }

    const [element] = args;

    if (typeof window === 'undefined') {
        var { window } = domEmulation;
    }

    if (!(element instanceof window.HTMLElement)) {
        throw new Error('"element" must be an HTML element');
    }

    const selectors = [];
    let currentElement = element;

    while (currentElement) {
        let selector = `${currentElement.tagName.toLowerCase()}`;

        if (currentElement.id) {
            selectors.push(`${selector}#${currentElement.id}`);
            break;
        }

        const currentElementClassName = currentElement.className;
        if (currentElementClassName.length) {
            selector += `.${currentElementClassName.trim().replace(/ +/g, '.')}`;
        }

        const parent = currentElement.parentElement;

        if (parent) {
            const elementSiblings = [...parent.children];

            if (elementSiblings.filter(item => item.className === currentElementClassName).length > 1 || !currentElementClassName.length ) {
                const elementIndex = elementSiblings.indexOf(currentElement);
                selector += `:nth-child(${elementIndex + 1})`;
            }
        }

        selectors.push(selector);
        currentElement = parent;
    }

    return selectors.reverse().join(' ');
}
