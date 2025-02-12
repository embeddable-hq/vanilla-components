const apiKey = '...';
const connectionName = 'my-db'; 

const BASE_URL = 'https://api.us.embeddable.com'; // US
// const BASE_URL = 'https://api.eu.embeddable.com'; // EU

/**
 * see db-specific examples @ https://trevorio.notion.site/Connections-API-ff4af10f7eaf4288b6952fde04e6e933
 */
const dbType = 'postgres'; // or bigquery, etc.
const credentials = {
    database: '...',
    host: '...',
    user: '...',
    password: '...'
}

async function run() {
    const resp = await fetch(`${BASE_URL}/api/v1/connections`, {
        method: 'POST', // POST = CREATE
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${apiKey}` /* keep your API Key secure */
        },
        body: JSON.stringify({
            name: `${connectionName}`,
            type: dbType, 
            credentials: credentials
        })
    });

    console.log(`${resp.status} ${resp.statusText}`);
    const json = await resp.json();
    console.log(json);
}

run();