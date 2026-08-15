const fs = require('fs');

const filePath = 'server/prompts/promptRegistry.ts';
let code = fs.readFileSync(filePath, 'utf8');

const universalFormattingRules = `
FORMATTING RULES:
1. You MUST use <h1> for the main document title. Add inline CSS: style="font-size: 28px; font-weight: bold; text-align: center; text-transform: uppercase; margin-bottom: 40px;"
2. You MUST use <h2> for all major sections (e.g., COMPANY DETAILS, PRELIMINARY, DEFINITIONS). Add inline CSS: style="font-size: 20px; font-weight: bold; text-transform: uppercase; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #ccc; padding-bottom: 5px;"
3. You MUST use <h3> for sub-sections. Add inline CSS: style="font-size: 16px; font-weight: bold; margin-top: 20px; margin-bottom: 10px;"
4. Use <p> for all regular paragraphs. Add inline CSS: style="margin-bottom: 15px; line-height: 1.6; text-align: justify;"
5. Use proper HTML <table> tags if a table is generated. The table MUST have borders using inline CSS (e.g., style="border: 1px solid black; border-collapse: collapse; width: 100%; margin-top: 20px; margin-bottom: 20px;"). All <th> and <td> must have style="border: 1px solid black; padding: 10px; text-align: left;"
6. Use <strong> to highlight important names and numbers.
`;

// Remove my previous FORMATTING RULES blocks that were specific to MOA/AOA
code = code.replace(/FORMATTING RULES:[\s\S]*?6\. Use <strong> to highlight important names and numbers\./g, '');

// Now inject the universal formatting rules right before MANDATORY STRUCTURE
code = code.replace(/MANDATORY STRUCTURE(:| & PREMIUM LEGAL STYLING DESIGN RULES:)/g, (match) => {
    return universalFormattingRules + '\n' + match;
});

// Write it back
fs.writeFileSync(filePath, code, 'utf8');
console.log('Successfully injected universal formatting rules into all prompts.');
