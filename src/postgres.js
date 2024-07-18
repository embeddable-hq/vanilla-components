const apiKey = '57be622e-12ce-4733-803f-40b2d46b4adb';
const connectionName = 'postgres-db';

/** 
 * creates a db connection named `my-db` 
 *  (which you can use in your model by setting the `data_source` field to `my-db`)
 */
const resp = await fetch(`https://api.embeddable.com/api/v1/connections`, {
	method: 'POST', // POST = CREATE
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Authorization': `Bearer ${apiKey}` /* keep your API Key secure */
	},
	body: JSON.stringify({
		name: `${connectionName}`,
		type: 'postgres',
		credentials: {
			database: 'smartify_prod',
			host: 'db2.cluster-caoe2zxbmz1z.eu-west-1.rds.amazonaws.com',
			user: 'census',
			password: 'T8aqrWmkqBbsHKa7Hr5ZmGpq',
			port: 5432,
			ssl: true // or { rejectUnauthorized: false }
		}
	})
});

console.log(`${resp.status} ${resp.statusText}`);
const json = await resp.json();
console.log(json);
