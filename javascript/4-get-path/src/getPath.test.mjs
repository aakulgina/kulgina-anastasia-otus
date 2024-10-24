import { strict as assert } from 'node:assert';
import { before, describe, it } from 'node:test';
import { getPath } from '../index.mjs';
import { createHtml, domEmulation, getPathHtml } from './utils.mjs';

describe('getPath function', () => {
    before(() => {
        createHtml(getPathHtml);
    });

    it('throws an error if no args were passed', () => {
        assert.throws(() => getPath(), { message: '"element" argument must be specified' });
    });

    it('throws an error if too many args were passed', () => {
        assert.throws(() => getPath('element', 'extraArg'), { message: 'getPath takes only "element" argument' });
    });

    it('throws an error if the desired arg is not an HTML element', () => {
        assert.throws(() => getPath('I am not an HTMLElement instance'), { message: '"element" must be an HTML element' });
    });

    it('returns correct selector for an HTML element that has an id attribute', () => {
        const targetSelector = 'div#lorem-id';
        const targetElement = domEmulation.window.document.querySelector(targetSelector);

        const assertedSelector = getPath(targetElement);
        const assertedElements = domEmulation.window.document.querySelectorAll(assertedSelector);

        assert.notEqual(assertedSelector, '');
        assert.equal(assertedSelector, targetSelector);
        assert.equal(assertedElements.length, 1);
        assert.equal(assertedElements[0], targetElement);
    });

    it('returns correct selector for an HTML element that has no id attribute but has class(-es)', () => {
        const targetSelector = 'div#root div.lorem-class-unique';
        const targetElement = domEmulation.window.document.querySelector(targetSelector);

        const assertedSelector = getPath(targetElement);
        const assertedElements = domEmulation.window.document.querySelectorAll(assertedSelector);

        assert.notEqual(assertedSelector, '');
        assert.equal(assertedSelector, targetSelector);
        assert.equal(assertedElements.length, 1);
        assert.equal(assertedElements[0], targetElement);
    });

    it('returns correct selector for an HTML element that has neither id attribute nor class(-es)', () => {
        const targetSelector = 'div#root div:nth-child(3)';
        const targetElement = domEmulation.window.document.querySelector(targetSelector);

        const assertedSelector = getPath(targetElement);
        const assertedElements = domEmulation.window.document.querySelectorAll(assertedSelector);

        assert.notEqual(assertedSelector, '');
        assert.equal(assertedSelector, targetSelector);
        assert.equal(assertedElements.length, 1);
        assert.equal(assertedElements[0], targetElement);
    });

    it('returns correct selector using :nth-child()', () => {
        const targetSelector = 'div#root div.lorem-class:nth-child(5) p:nth-child(2)';
        const targetElement = domEmulation.window.document.querySelector(targetSelector);

        const assertedSelector = getPath(targetElement);
        const assertedElements = domEmulation.window.document.querySelectorAll(assertedSelector);

        assert.notEqual(assertedSelector, '');
        assert.equal(assertedSelector, targetSelector);
        assert.equal(assertedElements.length, 1);
        assert.equal(assertedElements[0], targetElement);
    });
});
