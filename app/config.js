const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

module.exports = {
  rootPath: path.resolve(__dirname, ".."),
  secretkey: process.env.SECRET_KEY,
  serviceName: process.env.SERVICE_NAME,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPass: process.env.DB_PASS,
  dbPort: process.env.DB_PORT,
};
