import { loadEnvConfig } from './utils/envLoader.mjs';
import process from 'process';

loadEnvConfig();

const apiKey = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
// const BASE_URL = 'https://api.eu.embeddable.com'; // EU API

const environments = [
    {
        name: 'dev',
        dataSource: 'scalis-dev',
        connection: 'scalis-dev'
    },
    {
        name: 'stg', 
        dataSource: 'scalis-staging',
        connection: 'scalis-staging'
    },
    {
        name: 'prod',
        dataSource: 'scalis-prod', 
        connection: 'scalis-prod'
    }
];

async function createEnvironment(env) {
    const resp = await fetch(`https://${BASE_URL}/api/v1/environments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            name: env.name,
            datasources: [
                { data_source: env.dataSource, connection: env.connection }
            ]
        })
    });
    const json = await resp.json();
    console.log(json);
}

async function run() {
    for (const env of environments) {
        await createEnvironment(env);
    }
}

run();