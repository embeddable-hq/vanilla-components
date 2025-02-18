import { loadEnvConfig } from './utils/envLoader.mjs';
import process from 'process';

loadEnvConfig();

const apiKey = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const connections = [
    {
        connectionName: 'scalis-dev',
        host: 'jump-server.us.embeddable.internal',
        database: 'graphqldbv2',
        user: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        port: 8000
    },
    {
        connectionName: 'scalis-staging',
        host: 'jump-server.us.embeddable.internal',
        database: 'scalisdbv2',
        user: process.env.DB_USERNAME_STG,
        password: process.env.DB_PASSWORD_STG,
        port: 8001
    },
    {
        connectionName: 'scalis-prod',
        host: 'jump-server.us.embeddable.internal',
        database: 'scalisdbv2',
        user: process.env.DB_USERNAME_PROD,
        password: process.env.DB_PASSWORD_PROD,
        port: 8002
    }
];
const dbType = 'postgres'; // or bigquery, etc.

/**
 * see db-specific examples @ https://trevorio.notion.site/Connections-API-ff4af10f7eaf4288b6952fde04e6e933
 */
async function updateConnection(connection) {
    const resp = await fetch(`https://${BASE_URL}/api/v1/connections/${connection.connectionName}`, {
        method: 'PUT', // PUT = UPDATE
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}` /* keep your API Key secure */
        },
        body: JSON.stringify({
            type: dbType,
            credentials: {
                host: connection.host,
                database: connection.database,
                user: connection.user,
                password: connection.password,
                port: connection.port
            }
        })
    });

    console.log(`${resp.status} ${resp.statusText}`);
    const json = await resp.json();
    console.log(json);
}

async function run() {
    for (const connection of connections) {
        await updateConnection(connection);
    }
}

run();