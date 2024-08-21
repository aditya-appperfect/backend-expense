const Client = require("pg");
const { Pool } = Client;

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "App4ever#",
  database: "expense_tracker",
  max: 10,
  idleTimeoutMillis: 30000,
});

module.exports.getClient = async () => {
  const client = await pool.connect();
  return client;
};
