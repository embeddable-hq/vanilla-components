import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export function loadEnvConfig() {
    // Get current file's directory in ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    try {
        // Go up two directories to reach project root
        const envPath = path.resolve(__dirname, '../', '.env');
        
        // Check if .env file exists
        if (!fs.existsSync(envPath)) {
            throw new Error('.env file not found');
        }

        dotenv.config({ path: envPath });
    } catch (error) {
        console.error('Error loading .env file:', { error });
    }
} 