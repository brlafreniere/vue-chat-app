// The pg module uses environment variables to configure a connection.
// Environment variables are in .env as handled by the dotenv module.

pg = require('pg');
pg.types.setTypeParser(1114, str => str);
const { Pool } = require('pg');

const pool = new Pool();

pool.on('error', (err, client) => {
	console.error('Unexpected error on idle client', err)
	process.exit(-1)
})

module.exports = {
	query: (text, params) => pool.query(text, params)
}
