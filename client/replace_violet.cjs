const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const mappings = [
    { regex: /\btext-violet-[5678]00\b/g, replace: 'text-primary' },
    { regex: /\btext-violet-900\b/g, replace: 'text-foreground' },
    { regex: /\bbg-violet-[67]00\b/g, replace: 'bg-primary' },
    { regex: /\bbg-violet-500\b/g, replace: 'bg-primary/90' },
    { regex: /\bbg-violet-50\b/g, replace: 'bg-secondary' },
    { regex: /\bbg-violet-100\b/g, replace: 'bg-secondary/80' },
    { regex: /\bborder-violet-[567]00\b/g, replace: 'border-primary' },
    { regex: /\bborder-violet-200\b/g, replace: 'border-primary/20' },
    { regex: /\bborder-violet-100\b/g, replace: 'border-border' },
    { regex: /\bhover:text-violet-[567]00\b/g, replace: 'hover:text-primary' },
    { regex: /\bhover:bg-violet-[67]00\b/g, replace: 'hover:bg-primary/90' },
    { regex: /\bhover:bg-violet-50\b/g, replace: 'hover:bg-secondary' },
    { regex: /\bhover:border-violet-[567]00\b/g, replace: 'hover:border-primary' },
    { regex: /\bring-violet-[56]00\b/g, replace: 'ring-primary' },
    { regex: /\bfocus:ring-violet-[56]00\b/g, replace: 'focus:ring-primary' },
    { regex: /\bfocus:border-violet-[56]00\b/g, replace: 'focus:border-primary' },
    { regex: /\bshadow-violet-[12]00\b/g, replace: 'shadow-sm' },
    { regex: /\bfrom-violet-[567]00\b/g, replace: 'from-primary' },
    { regex: /\bto-violet-[567]00\b/g, replace: 'to-primary' },
    { regex: /\bvia-violet-[567]00\b/g, replace: 'via-primary/90' },
    { regex: /\btext-violet-400\b/g, replace: 'text-primary/80' },
    { regex: /\bfill-violet-[567]00\b/g, replace: 'fill-primary' }
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(srcDir);
let changedFiles = 0;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    
    mappings.forEach(map => {
        newContent = newContent.replace(map.regex, map.replace);
    });
    
    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        changedFiles++;
    }
});

console.log(`Replaced violet colors in ${changedFiles} files.`);
