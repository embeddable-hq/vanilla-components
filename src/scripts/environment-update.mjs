import { loadEnvConfig } from './utils/envLoader.mjs';
import process from 'process';

loadEnvConfig();

const apiKey = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const environments = [
    {
        name: 'dev',
        datasources: [
            { data_source: 'default', connection: 'scalis-dev' }
        ]
    },
    {
        name: 'stg',
        datasources: [
            { data_source: 'default', connection: 'scalis-staging' },
        ]
    },
    {
        name: 'prod',
        datasources: [
            { data_source: 'default', connection: 'scalis-prod' },
        ]
    }
];
// const BASE_URL = 'https://api.eu.embeddable.com'; // EU API

async function run() {
    for (const env of environments) {
        const resp = await fetch(`https://${BASE_URL}/api/v1/environments/${env.name}`, {
            method: 'PUT',  // Using PUT to update existing environments
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(env)
        });
        
        const json = await resp.json();
        console.log(`Updated environment ${env.name}:`, json);
    }
}

run();