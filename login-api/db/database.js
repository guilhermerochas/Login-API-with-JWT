const { Pool } = require("pg");

//Connect to database
const pool = new Pool({
  user: "<USER>",
  host: "<HOST>",
  password: "<PASSWORD>",
  port: 5432,
  database: "<DATABASE>",
});

module.exports = pool;
