import { annotate } from 'https://unpkg.com/rough-notation?module';

"use strict";

export function mark(element) {
    const annotation = annotate(element, { type: 'highlight' });
    annotation.show();
}

export function underline(element) {
    const annotation = annotate(element, { type: 'underline' });
    annotation.show();
}

export function cross(element) {
    const annotation = annotate(element, { type: 'crossed-off' });
    annotation.show();
}

export function strikethrough(element) {
    const annotation = annotate(element, { type: 'strike-through' });
    annotation.show();
}

export function box(element) {
    const annotation = annotate(element, { type: 'box' });
    annotation.show();
}