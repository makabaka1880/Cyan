import { renderMarkdown } from './markdownSupport.mjs';
import { mark, underline, cross, box, strikethrough } from './roughNotationSupport.mjs';
import { USE_ROUGH } from './constants.mjs';

"use strict";

const defaultCSS = document.getElementById('default-markings-css');
const roughCSS = document.getElementById('rough-markings-css');

document.querySelectorAll('.md').forEach(element => {
    element.innerHTML = renderMarkdown(element.innerHTML);
});

if (USE_ROUGH) {
    defaultCSS.disabled = true;

    const marksArray = Array.from(document.querySelectorAll('mark'));
    marksArray.forEach(element => {
        mark(element);
    });

    const underlineArray = Array.from(document.querySelectorAll('u'));
    underlineArray.forEach(element => {
        underline(element);
    });

    const delArray = Array.from(document.querySelectorAll('del'));
    delArray.forEach(element => {
        strikethrough(element);
    });

    const boxArray = Array.from(document.querySelectorAll('box'));
    boxArray.forEach(element => {
        box(element);
    });

} else {
    roughCSS.disabled = true;
    const body = document.getElementById('content');
}
