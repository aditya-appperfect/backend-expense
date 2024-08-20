const { Client } = require("pg");

module.exports.getClient = async () => {
  try {
    const client = new Client({
      host: "localhost",
      user: "postgres",
      port: 5432,
      password: "App4ever#",
      database: "expense_tracker",
    });
    await client.connect();
    return client;
  } catch (err) {
    console.log("Error at Connect", err);
  }
};
