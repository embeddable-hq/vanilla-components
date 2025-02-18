require('dotenv').config();

const apiKey = process.env.API_KEY;
const connectionName = process.env.CONNECTION_NAME || 'my-db';

const BASE_URL = process.env.BASE_URL || 'https://api.us.embeddable.com';

async function run() {
    const resp = await fetch(`${BASE_URL}/api/v1/connections/${connectionName}`, {
        method: 'GET', 
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}` /* keep your API Key secure */
        }
    });

    console.log(`${resp.status} ${resp.statusText}`);
    const json = await resp.json();
    console.log(json);
}

run();