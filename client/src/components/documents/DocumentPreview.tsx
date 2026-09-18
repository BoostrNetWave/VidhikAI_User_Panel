import React from 'react';

// --- CONSTANT PREVIEW DESIGN CONFIGURATION ---
// These styles define the "Premium A4 Paper" look and should remain constant
// to maintain professional document presentation.
export const PREVIEW_DESIGN = {
    // Outer container: Desktop-like surface with radial grid
    container: "w-full bg-slate-100/70 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] py-12 px-4 min-h-[600px] flex justify-center",

    // The "Paper": A4 dimensions with professional drop shadow
    paper: "bg-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] w-full max-w-[210mm] min-h-[297mm] p-[25.4mm] mx-auto border border-gray-100 rounded-sm",

    // Typography: Legal-grade serif settings
    typography: "prose max-w-none font-['Lora',serif] text-slate-900",

    // Heading & Paragraph overrides
    proseStyles: "prose-headings:text-black prose-headings:font-['Lora',serif] prose-headings:font-bold " +
        "prose-h1:text-2xl prose-h1:mb-8 prose-h1:text-center prose-h1:uppercase prose-h1:tracking-[0.15em] " +
        "prose-h2:text-lg prose-h2:mt-10 prose-h2:mb-4 prose-h2:uppercase prose-h2:tracking-wider prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 " +
        "prose-h3:text-base prose-h3:mt-6 prose-h3:mb-3 " +
        "prose-p:mb-5 prose-p:leading-[1.8] prose-p:text-justify text-[15px] " +
        "prose-ul:ml-6 prose-ol:ml-6 prose-li:mb-2 prose-li:leading-relaxed"
};

/**
 * Format any document content (HTML, Markdown, or raw text) into clean, standard legal HTML.
 */
export function formatToLegalHtml(raw: string): string {
    if (!raw || typeof raw !== 'string' || !raw.trim()) {
        return '<p class="text-gray-400 italic text-center py-12">No document content available.</p>';
    }

    // If it already has structural HTML tags (<p>, <div>, <h1>-<h6>, <ul>, <ol>, <table>), return as is
    const hasHtmlTags = /<\s*(p|div|h[1-6]|ul|ol|table|article|section)\b[^>]*>/i.test(raw);
    if (hasHtmlTags) {
        return raw;
    }

    // Convert plain text or markdown to structured legal HTML
    const blocks = raw.split(/\n{2,}/);
    return blocks.map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return '';

        // Markdown headings
        if (trimmed.startsWith('# ')) {
            return `<h1>${trimmed.substring(2)}</h1>`;
        }
        if (trimmed.startsWith('## ')) {
            return `<h2>${trimmed.substring(3)}</h2>`;
        }
        if (trimmed.startsWith('### ')) {
            return `<h3>${trimmed.substring(4)}</h3>`;
        }

        // Detect all-caps title or clause heading (e.g. "ARTICLES OF ASSOCIATION" or "1. PRELIMINARY")
        const isAllCaps = trimmed.length < 90 && trimmed === trimmed.toUpperCase() && !/^\d+$/.test(trimmed);
        if (isAllCaps) {
            if (trimmed.length < 60 && (
                trimmed.includes('AGREEMENT') ||
                trimmed.includes('ASSOCIATION') ||
                trimmed.includes('CONTRACT') ||
                trimmed.includes('RESOLUTION') ||
                trimmed.includes('NOTICE') ||
                trimmed.includes('MEMORANDUM') ||
                trimmed.includes('POLICY')
            )) {
                return `<h1>${trimmed}</h1>`;
            }
            return `<h2>${trimmed}</h2>`;
        }

        // Detect numbered clause heading, e.g. "Clause 1. Definitions" or "1. DEFINITIONS"
        if (/^(clause\s+\d+|article\s+\d+|\d+\.\s+[A-Z\s]{3,})/i.test(trimmed) && trimmed.length < 80) {
            return `<h2>${trimmed}</h2>`;
        }

        // Detect bullet lists
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const items = trimmed.split('\n').map(l => l.replace(/^[-*]\s+/, '').trim()).filter(Boolean);
            return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
        }

        // Detect numbered lists like 1. item \n 2. item
        if (/^\d+\.\s+/m.test(trimmed) && trimmed.includes('\n')) {
            const items = trimmed.split('\n').map(l => l.replace(/^\d+\.\s+/, '').trim()).filter(Boolean);
            return `<ol>${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
        }

        // Key-value pairs like "Date: 12th Jan 2025"
        if (/^[A-Za-z\s]{2,25}:\s+/m.test(trimmed) && trimmed.split('\n').every(l => l.includes(':') || l.trim() === '')) {
            const pairs = trimmed.split('\n').filter(Boolean).map(l => {
                const idx = l.indexOf(':');
                if (idx !== -1) {
                    const k = l.substring(0, idx).trim();
                    const v = l.substring(idx + 1).trim();
                    return `<p class="mb-2"><strong>${k}:</strong> ${v}</p>`;
                }
                return `<p class="mb-2">${l}</p>`;
            });
            return pairs.join('');
        }

        // Bold inline markdown (**text**) and italics (*text*)
        const formattedText = trimmed
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br/>');

        return `<p>${formattedText}</p>`;
    }).filter(Boolean).join('');
}

interface DocumentPreviewProps {
    content: string;
    className?: string;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({ content, className = "" }) => {
    const formattedContent = React.useMemo(() => formatToLegalHtml(content), [content]);

    return (
        <div id="document-preview-content" className={`${PREVIEW_DESIGN.container} ${className}`}>
            <div
                className={`${PREVIEW_DESIGN.paper} ${PREVIEW_DESIGN.typography} ${PREVIEW_DESIGN.proseStyles}`}
                dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
        </div>
    );
};
