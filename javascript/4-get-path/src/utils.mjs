import { JSDOM } from 'jsdom';

export const domEmulation = new JSDOM();

export const getPathHtml = `
<div id="lorem-id">Lorem ipsum dolor sit amet.</div>
<div class="lorem-class-unique">Lorem, ipsum dolor.</div>
<div>Lorem ipsum dolor sit amet, consectetur adipisicing.</div>
<div class="lorem-class">
    <p>Lorem ipsum dolor sit.</p>
    <p>Lorem ipsum dolor sit.</p>
    <p>Lorem ipsum dolor sit.</p>
</div>
<div class="lorem-class">
    <p>Lorem ipsum dolor sit.</p>
    <p>Lorem ipsum dolor sit.</p>
    <p>Lorem ipsum dolor sit.</p>
</div>
`

export function createHtml(payload) {
    if (typeof payload !== 'string') {
        throw new Error('createHtml takes "payload" as string')
    }

    const root = domEmulation.window.document.createElement('div');
    root.id = 'root';
    root.innerHTML = payload.trim();

    domEmulation.window.document.body.appendChild(root);
}
