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
        
        if (content.includes('JSON.stringify(data, null, 2)')) {
            content = content.replace(/JSON\.stringify\(data, null, 2\)/g, 'JSON.stringify(formData, null, 2)');
            fs.writeFileSync(filePath, content);
            console.log('Fixed data to formData in', filePath);
        }
    }
}
