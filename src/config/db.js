const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost', // 'db' if inside Docker, 'localhost' if outside
  database: process.env.DB_NAME || 'delivery_db',
  password: process.env.DB_PASSWORD || 'delivery_password',
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};