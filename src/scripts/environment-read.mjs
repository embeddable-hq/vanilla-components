import { loadEnvConfig } from './utils/envLoader.mjs';
import process from 'process';

loadEnvConfig();

const apiKey = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const environments = ['dev', 'stg', 'prod'];
// const BASE_URL = 'https://api.eu.embeddable.com'; // EU API

async function run() {
    for (const env of environments) {
        const resp = await fetch(`https://${BASE_URL}/api/v1/environments/${env}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
        });
        const json = await resp.json();
        console.log(json);
    }
}

run();