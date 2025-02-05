import { parseTable } from './markdownTables.mjs'
import { mark } from './roughNotationSupport.mjs';

"use strict";

/**
 * Helper function to parse the markdown content excluding code blocks.
 */
export function parseMarkdownContent(markdown) {
    // Convert headings
    markdown = markdown.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    markdown = markdown.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/^### (.*?)$/gm, '<h3>$1</h3>');

    // Convert bold text
    markdown = markdown.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Convert italic text
    markdown = markdown.replace(/\*(.*?)\*/g, '<i>$1</i>');

    // Convert strikethrough
    markdown = markdown.replace(/~~(.*?)~~/g, '<del>$1</del>');

    // Convert underline
    markdown = markdown.replace(/~(.*?)~/g, '<u>$1</u>');

    // Convert mark (highlighted text)
    markdown = markdown.replace(/==(.*?)==/g, '<mark>$1</mark>');

    // Convert lists
    markdown = markdown.replace(/^- (.*?)$/gm, '<li>$1</li>');
    markdown = markdown.replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>');

    markdown = parseTable(markdown);

    return markdown;
}

/**
 * Main function to render markdown, ensuring code blocks are not affected.
 */
export function renderMarkdown(markdown) {
    // Process code fences first
    const codeFenceRegex = /```([\s\S]*?)```/g;
    const codeBlocks = [];
    markdown = markdown.replace(codeFenceRegex, (match, code) => {
        // Escape HTML entities in code blocks
        const escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        codeBlocks.push(`<pre><code>${escapedCode}</code></pre>`);
        return `\u0000CODE_BLOCK_${codeBlocks.length - 1}\u0000`;
    });

    // Process inline double ticks
    const doubleTickRegex = /``([^`]+?)``/g;
    const doubleTickBlocks = [];
    markdown = markdown.replace(doubleTickRegex, (match, code) => {
        // Escape HTML entities for content inside double ticks
        const escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        doubleTickBlocks.push(`<code>\`${escapedCode}\`</code>`);
        return `\u0000DOUBLE_TICK_${doubleTickBlocks.length - 1}\u0000`;
    });

    // Process inline single ticks
    const inlineCodeRegex = /`([^`]+?)`/g;
    const inlineCodeBlocks = [];
    markdown = markdown.replace(inlineCodeRegex, (match, code) => {
    // Escape HTML entities in inline code blocks
        const escapedCode = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
            inlineCodeBlocks.push(`<code class='inline'>${escapedCode}</code>`);
        const parsed = `\u0000INLINE_CODE_${inlineCodeBlocks.length - 1}\u0000`
        return parsed;
    });

    // Parse the rest of the markdown content
    markdown = parseMarkdownContent(markdown);

    // Restore double ticks
    markdown = markdown.replace(/\u0000DOUBLE_TICK_(\d+)\u0000/g, (_, index) => doubleTickBlocks[parseInt(index, 10)]);

    // Restore inline code blocks
    markdown = markdown.replace(/\u0000INLINE_CODE_(\d+)\u0000/g, (_, index) => inlineCodeBlocks[parseInt(index, 10)]);

    // Restore code blocks
    markdown = markdown.replace(/\u0000CODE_BLOCK_(\d+)\u0000/g, (_, index) => codeBlocks[parseInt(index, 10)]);

    return markdown;
}