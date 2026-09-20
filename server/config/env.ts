// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidatePaths = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), 'server', '.env'),
    path.join(process.cwd(), '..', '.env'),
    path.resolve(__dirname, '..', '.env'),
    path.resolve(__dirname, '..', '..', '.env')
];

let loaded = false;
for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
        console.log(`[Env Loader] Found .env at: ${p}`);
        dotenv.config({ path: p });
        loaded = true;
    }
}

if (!loaded) {
    dotenv.config();
}

console.log("[Env Loader] OPENAI_API_KEY:", process.env.OPENAI_API_KEY ? 'CONFIGURED' : 'NOT SET');
console.log("[Env Loader] PORT from .env:", process.env.PORT || 5003);
