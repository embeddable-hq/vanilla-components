import { loadEnvConfig } from './utils/envLoader.mjs';
import process from 'process';

loadEnvConfig();

const apiKey = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

async function run() {
    const resp = await fetch(`https://${BASE_URL}/api/v1/environments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}` /* keep your API Key secure */,
        },
    });
    const json = await resp.json();
    console.log(json);
}

run();