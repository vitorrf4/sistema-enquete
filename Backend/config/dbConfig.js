const {Sequelize} = require("sequelize");
require("dotenv").config();

const dbConfig = process.env.DB_NAME;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const host = process.env.DB_HOST;
const dialect = process.env.DB_DIALECT;

const sequelize = new Sequelize(dbConfig, username, password, {
  host: host,
  dialect: dialect,
});

(async () => { sequelize.sync().then() })();
module.exports = sequelize;
