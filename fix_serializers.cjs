const fs = require('fs');
const path = require('path');

const dirs = [
    'd:\\BooterNetWave\\VidhikAI\\user-admin2\\server\\prompts\\corporate',
    'd:\\BooterNetWave\\VidhikAI\\user-admin2\\server\\prompts\\employment',
    'd:\\BooterNetWave\\VidhikAI\\user-admin2\\server\\prompts\\commercial',
    'd:\\BooterNetWave\\VidhikAI\\user-admin2\\server\\prompts\\ip'
];

for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (!file.endsWith('.ts')) continue;
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const regex = /(export const generate[A-Za-z0-9]+Prompt = \(formData: any\): string => \{)[\s\S]*?(return JSON\.stringify\([a-zA-Z0-9]+,\s*null,\s*2\);\s*\};)/;
        
        if (regex.test(content)) {
            content = content.replace(regex, `$1\n    return JSON.stringify(formData, null, 2);\n};`);
            fs.writeFileSync(filePath, content);
            console.log('Fixed', filePath);
        } else {
            console.log('Skipped', filePath);
        }
    }
}
