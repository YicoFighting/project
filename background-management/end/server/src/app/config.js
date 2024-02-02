const dotenv = require("dotenv");
// 将.env加载到process.env
dotenv.config();

//读取文件
const fs = require("fs");
const path = require("path");

// 获取私钥
const PRIVATE_KEY = fs.readFileSync(
  path.resolve(__dirname, "./keys/private.key")
);

// 获取公钥
const PUBLIC_KEY = fs.readFileSync(
  path.resolve(__dirname, "./keys/public.key")
);

//导出配置
module.exports = {
  APP_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
  REDIS_URL,
  REDIS_PORT,

  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_DATABASE,
  MYSQL_USER,
  MYSQL_PASSWORT,
} = process.env;

//导出私钥与公钥
module.exports.PRIVATE_KEY = PRIVATE_KEY;
module.exports.PUBLIC_KEY = PUBLIC_KEY;
