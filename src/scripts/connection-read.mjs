import { loadEnvConfig } from './utils/envLoader.mjs';
import process from 'process';

loadEnvConfig();

const apiKey = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;

const connections = [
    {
        name: 'scalis-dev'
    },
    {
        name: 'scalis-staging'
    },
    {
        name: 'scalis-prod'
    },
];

async function readConnection(connection) {
    const resp = await fetch(`https://${BASE_URL}/api/v1/connections/${connection.name}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    });

    console.log(`${resp.status} ${resp.statusText}`);
    const json = await resp.json();
    console.log(json);
}

async function run() {
    for (const connection of connections) {
        await readConnection(connection);
    }
}

run();