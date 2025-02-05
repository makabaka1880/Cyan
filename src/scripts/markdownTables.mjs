"use strict";

export function replaceLine(lines, index, newLine) {
    if (index < 0 || index >= lines.length) {
        throw new Error("Index out of bounds");
    }
    return lines.map((line, i) => i === index ? newLine : line);
}

export function mergeArrays(text, tables) {
    return text.flatMap((t, i) => [t, tables[i] || ""]).join("");
}

export function splitColumns(line) {
    return line.split('|').map(cell => cell.trim()).filter(Boolean);
}

export function isSeperatorLine(line) {
    const cells = splitColumns(line)
    if (cells.length == 0) return false
    return cells.every(part => /^:?-+:?$/.test(part));
}

export function createTable(table) {
    let tableHTML = "<table><tr>";
    table.header.forEach(element => {
        tableHTML += `<th>${element}`
    });
    tableHTML += "</tr>";
    table.table.forEach(row => {
        tableHTML += "<tr>"
        row.forEach(cell => {
            tableHTML += `<td>${cell}</td>`
        })
        tableHTML += "</tr>"
    })
    tableHTML += "</table>"
    return tableHTML;
}

export function parseTable(markdown) {
    const lines = markdown.split('\n');
    const text = markdown.split(/(?:[|]?.*[|]?)\n[|]?\s*(?:\:?-+\:?\s*[|]?\s*)+\n(?:(?:[|]?.*[|]?\n?)+?)/);
    const tables = [];
    var currentTable = [];
    var currentHeader = [];
    for (let i = 0; i < lines.length; i += 1) {
        if (isSeperatorLine(lines[i]) && i != 0) {
            currentHeader = splitColumns(lines[i - 1]);
            for (let j = i + 1; i < lines.length; j += 1) {
                const line = lines[j];
                if (line.includes('|')) {
                    currentTable.push(splitColumns(lines[j]));
                } else {
                    tables.push({header: currentHeader, table: currentTable});
                    currentTable = [];
                    currentHeader = [];
                    break;
                }
            }
        }
    }
    console.log('----')
    text.forEach(element => console.log(element))
    const tableHTMLs = tables.map(table => createTable(table));

    return mergeArrays(text, tableHTMLs);
}