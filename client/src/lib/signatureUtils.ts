/**
 * Utility functions for Digital Signature manipulation in document HTML.
 * Guarantees that any existing signature is replaced (never duplicated),
 * and layout alignment remains consistent across edit, preview, and PDF modes.
 */

export function applyOrReplaceSignature(currentHtml: string, newSignatureHtml: string): string {
    if (!currentHtml || !currentHtml.trim()) {
        return newSignatureHtml;
    }

    // 1. Standard: replace existing <div class="...vidhik-signature-block...">...</div>
    const blockRegex = /<div[^>]*class=["'][^"']*vidhik-signature-block[^"']*["'][^>]*>[\s\S]*?<\/div>/gi;
    if (blockRegex.test(currentHtml)) {
        return currentHtml.replace(blockRegex, newSignatureHtml);
    }

    // 2. Orphaned fallback: if Quill unrolled the outer div into paragraphs ending with sig-badge
    const orphanedRegex = /(?:<p[^>]*>.*?<\/p>\s*)*(?:<div[^>]*class=["'][^"']*sig-badge[^"']*["'][^>]*>[\s\S]*?<\/div>)/gi;
    if (orphanedRegex.test(currentHtml)) {
        return currentHtml.replace(orphanedRegex, newSignatureHtml);
    }

    // 3. Fallback: match any element with id="digital-signature-block"
    const idRegex = /<[^>]+id=["']digital-signature-block["'][^>]*>[\s\S]*?<\/[^>]+>/gi;
    if (idRegex.test(currentHtml)) {
        return currentHtml.replace(idRegex, newSignatureHtml);
    }

    // 4. If no signature exists yet, append cleanly at the end
    return currentHtml.trim() + '\n\n' + newSignatureHtml;
}
