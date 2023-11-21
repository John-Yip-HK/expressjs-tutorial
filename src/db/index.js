const { Client } = require('pg');
const client = new Client({
  user: 'johnyip',
  database: 'express-postgres',
  host: '127.0.0.1',
  port: 5432,
  connectionTimeoutMillis: 10 * 1000,
});

client.connect()
  .then(() => {
    console.log('Connected to DB');
  })
  .catch(console.error);

const dbQuery = async (query, params) => {
  const { rows } = await client.query(query, params);

  return rows;
}

module.exports = { dbQuery };