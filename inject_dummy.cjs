const fs = require('fs');
const path = require('path');

const dirs = [
    'd:\\BooterNetWave\\VidhikAI\\user-admin2\\client\\src\\pages\\documents\\corporate',
    'd:\\BooterNetWave\\VidhikAI\\user-admin2\\client\\src\\pages\\documents\\employment',
    'd:\\BooterNetWave\\VidhikAI\\user-admin2\\client\\src\\pages\\documents\\commercial',
    'd:\\BooterNetWave\\VidhikAI\\user-admin2\\client\\src\\pages\\documents\\ip'
];

for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (!file.endsWith('Form.tsx')) continue;
        const baseName = file.replace('Form.tsx', '');
        const agreementFile = path.join(dir, `${baseName}Agreement.tsx`);
        if (!fs.existsSync(agreementFile)) continue;
        
        const formContent = fs.readFileSync(path.join(dir, file), 'utf8');
        const match = formContent.match(/setFormData\(\{\s*\.\.\.formData,\s*([\s\S]*?)\s*\}\);/);
        
        if (match && match[1]) {
            const dummyDataStr = match[1];
            
            let agreementContent = fs.readFileSync(agreementFile, 'utf8');
            const replaceMatch = agreementContent.match(/const initialData = \{\s*([\s\S]*?)\s*\};/);
            
            if (replaceMatch) {
                agreementContent = agreementContent.replace(
                    /const initialData = \{\s*[\s\S]*?\s*\};/,
                    `const initialData = {\n${dummyDataStr}\n    };`
                );
                fs.writeFileSync(agreementFile, agreementContent);
                console.log('Injected dummy data into', agreementFile);
            }
        }
    }
}
