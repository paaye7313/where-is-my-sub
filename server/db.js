const { Pool } = require('pg')
require('dotenv').config()

const pool = process.env.DB_URL
  ? new Pool({
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false },
  })
  : new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  })

module.exports = pool