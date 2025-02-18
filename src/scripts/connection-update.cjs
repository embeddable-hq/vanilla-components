require('dotenv').config();

const apiKey = process.env.API_KEY;
const connectionName = process.env.CONNECTION_NAME || 'my-db';

const BASE_URL = process.env.BASE_URL || 'https://api.us.embeddable.com';

const dbType = process.env.DB_TYPE || 'postgres';
const credentials = {
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
}

async function run() {
    const resp = await fetch(`${BASE_URL}/api/v1/connections/${connectionName}`, {
        method: 'PUT', // PUT = UPDATE
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}` /* keep your API Key secure */
        },
        body: JSON.stringify({
    		type: dbType, 
    		credentials: credentials
        })
    });

    console.log(`${resp.status} ${resp.statusText}`);
    const json = await resp.json();
    console.log(json);
}

run();