import { Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, BorderStyle, WidthType, ImageRun } from 'docx';

interface InheritedStyles {
    textAlign?: string;
    fontWeight?: string;
    fontStyle?: string;
    textDecoration?: string;
    fontSize?: string;
    textTransform?: string;
}

export function getAlignment(textAlign?: string) {
    if (textAlign === 'center') return AlignmentType.CENTER;
    if (textAlign === 'right') return AlignmentType.RIGHT;
    if (textAlign === 'justify') return AlignmentType.JUSTIFIED;
    if (textAlign === 'left') return AlignmentType.LEFT;
    return undefined;
}

export function parseChildren(node: Node, styles: InheritedStyles): TextRun[] {
    const runs: TextRun[] = [];

    if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent) {
            const parent = node.parentElement;
            const isHeading = parent?.tagName.startsWith('H');
            const hLevel = isHeading ? parseInt(parent!.tagName.substring(1)) : 0;

            let fontSize = 24; // 12pt default (24 half-points)
            if (styles.fontSize) {
                const pxMatch = styles.fontSize.match(/(\d+)px/);
                if (pxMatch) {
                    const px = parseInt(pxMatch[1]);
                    // 1px = 0.75pt = 1.5 half-points
                    fontSize = Math.round(px * 1.5);
                } else {
                    const ptMatch = styles.fontSize.match(/(\d+)pt/);
                    if (ptMatch) {
                        fontSize = parseInt(ptMatch[1]) * 2;
                    }
                }
            } else if (hLevel === 1) fontSize = 42; // 21pt (28px)
            else if (hLevel === 2) fontSize = 30; // 15pt (20px)
            else if (hLevel === 3) fontSize = 24; // 12pt (16px)

            runs.push(new TextRun({
                text: node.textContent,
                font: "Calibri",
                size: fontSize,
                bold: styles.fontWeight === 'bold' || isHeading,
                italics: styles.fontStyle === 'italic',
                underline: styles.textDecoration === 'underline' ? { type: "single" } : undefined,
                allCaps: styles.textTransform === 'uppercase',
            }));
        }
        return runs;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return [];
    }

    const element = node as HTMLElement;
    if (element.tagName === 'BR') {
        return [new TextRun({ break: 1 })];
    }

    const currentStyles: InheritedStyles = {
        textAlign: element.style.textAlign || styles.textAlign,
        fontWeight: (element.tagName === 'STRONG' || element.tagName === 'B' || element.style?.fontWeight === 'bold') ? 'bold' : styles.fontWeight,
        fontStyle: (element.tagName === 'EM' || element.tagName === 'I' || element.style?.fontStyle === 'italic') ? 'italic' : styles.fontStyle,
        textDecoration: (element.tagName === 'U' || element.style?.textDecoration === 'underline') ? 'underline' : styles.textDecoration,
        fontSize: element.style.fontSize || styles.fontSize,
        textTransform: element.style.textTransform || styles.textTransform,
    };

    element.childNodes.forEach(child => {
        const childRuns = parseChildren(child, currentStyles);
        runs.push(...childRuns);
    });

    return runs;
}

export function processNode(node: Node, styles: InheritedStyles): Paragraph[] {
    if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent?.trim()) {
            return [new Paragraph({
                children: parseChildren(node, styles),
                alignment: getAlignment(styles.textAlign)
            })];
        }
        return [];
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return [];
    }

    const element = node as HTMLElement;
    const tagName = element.tagName.toUpperCase();

    // Check Quill classes or inline style for alignment
    let effectiveAlign = element.style.textAlign || styles.textAlign;
    if (element.classList) {
        if (element.classList.contains('ql-align-center') || element.classList.contains('align-center')) {
            effectiveAlign = 'center';
        } else if (element.classList.contains('ql-align-right') || element.classList.contains('align-right')) {
            effectiveAlign = 'right';
        } else if (element.classList.contains('ql-align-justify')) {
            effectiveAlign = 'justify';
        } else if (element.classList.contains('ql-align-left') || element.classList.contains('align-left')) {
            effectiveAlign = 'left';
        }
    }

    // Check indentation levels (ql-indent-1 through 8)
    let indentLevel = 0;
    if (element.classList) {
        for (let i = 1; i <= 8; i++) {
            if (element.classList.contains(`ql-indent-${i}`)) {
                indentLevel = i;
                break;
            }
        }
    }

    const currentStyles: InheritedStyles = {
        textAlign: effectiveAlign,
        fontWeight: element.style.fontWeight || styles.fontWeight,
        fontSize: element.style.fontSize || styles.fontSize,
    };

    if (tagName === 'IMG') {
        const src = element.getAttribute('src') || '';
        if (src.startsWith('data:image/')) {
            try {
                const base64Data = src.split(',')[1];
                if (base64Data) {
                    const binaryString = atob(base64Data);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    return [new Paragraph({
                        children: [new ImageRun({
                            data: bytes,
                            transformation: {
                                width: 170,
                                height: 50
                            }
                        })],
                        alignment: getAlignment(effectiveAlign) || AlignmentType.LEFT
                    })];
                }
            } catch (imgErr) {
                console.warn('Failed to parse signature image for docx:', imgErr);
            }
        }
        return [];
    }

    if (tagName === 'TABLE') {
        const rows: TableRow[] = [];
        const processChildren = (parent: Node) => {
            Array.from(parent.childNodes).forEach(child => {
                const nodeName = child.nodeName;
                if (nodeName === 'TR') {
                    const cells: TableCell[] = [];
                    Array.from(child.childNodes).forEach(td => {
                        if (td.nodeName === 'TD' || td.nodeName === 'TH') {
                            const cellStyles = { ...currentStyles, textAlign: (td as HTMLElement).style.textAlign || 'left' };
                            const cellChildren = Array.from(td.childNodes).flatMap(n => processNode(n, cellStyles));
                            
                            // DOCX TableCell requires at least one paragraph
                            const validChildren = cellChildren.length > 0 ? cellChildren : [new Paragraph("")];
                            
                            cells.push(new TableCell({
                                children: validChildren as any,
                                margins: { top: 100, bottom: 100, left: 100, right: 100 },
                                borders: {
                                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
                                }
                            }));
                        }
                    });
                    if (cells.length > 0) {
                        rows.push(new TableRow({ children: cells }));
                    }
                } else if (['TBODY', 'THEAD', 'TFOOT'].includes(nodeName)) {
                    processChildren(child);
                }
            });
        };

        processChildren(element);
        
        if (rows.length > 0) {
            return [new Table({
                rows: rows,
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" }
                }
            }) as any];
        }
        return [];
    } else if (['DIV', 'SECTION', 'ARTICLE', 'HEADER', 'FOOTER'].includes(tagName)) {
        return Array.from(element.childNodes).flatMap(n => processNode(n, currentStyles));
    } else if (tagName === 'P') {
        const indentProps = indentLevel > 0 ? { left: indentLevel * 720 } : undefined;
        return [new Paragraph({
            children: parseChildren(element, currentStyles),
            spacing: { before: 120, after: 120, line: 360 }, // 1.5 line spacing
            indent: indentProps,
            alignment: getAlignment(effectiveAlign) || AlignmentType.JUSTIFIED
        })];
    } else if (tagName.startsWith('H')) {
        const level = parseInt(tagName.substring(1));
        const headingLevel = level === 1 ? HeadingLevel.HEADING_1 :
            level === 2 ? HeadingLevel.HEADING_2 :
                level === 3 ? HeadingLevel.HEADING_3 :
                    level === 4 ? HeadingLevel.HEADING_4 :
                        level === 5 ? HeadingLevel.HEADING_5 : HeadingLevel.HEADING_6;

        return [new Paragraph({
            children: parseChildren(element, { ...currentStyles, fontWeight: 'bold' }),
            heading: headingLevel,
            spacing: { before: level === 1 ? 800 : 400, after: level === 1 ? 400 : 200 },
            alignment: getAlignment(effectiveAlign) || (level === 1 ? AlignmentType.CENTER : AlignmentType.LEFT)
        })];
    } else if (tagName === 'UL' || tagName === 'OL') {
        return Array.from(element.childNodes).flatMap(li => {
            if (li.nodeName === 'LI') {
                return [new Paragraph({
                    children: parseChildren(li, currentStyles),
                    bullet: { level: 0 },
                    spacing: { before: 100, after: 100, line: 360 }
                })];
            }
            return [];
        });
    } else if (tagName === 'BR') {
        return [new Paragraph({ spacing: { after: 200 } })];
    } else {
        const runs = parseChildren(element, currentStyles);
        if (runs.length > 0) {
            return [new Paragraph({
                children: runs,
                spacing: { after: 200 },
                alignment: getAlignment(styles.textAlign)
            })];
        }
    }
    return [];
}

export function parseHtmlToDocx(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    return Array.from(doc.body.childNodes).flatMap(node => processNode(node, {}));
}
