const mysql = require("mysql2");

//导入数据库配置
const config = require("../app/config");

//连接池配置
const connections = mysql.createPool({
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  database: config.MYSQL_DATABASE,
  user: config.MYSQL_USER,
  password: config.MYSQL_PASSWORT,
});

//事务
const affairsConn = () =>
  new Promise((res, rej) => {
    connections.getConnection((err, conn) => {
      if (err) {
        console.error(
          "数据库连接错误：" + err.stack + "\n" + "连接ID：" + conn.threadId
        );
        rej(err);
      } else {
        console.log("数据库连接成功");
        res(conn);
      }
    });
  });

//普通数据库服务
const Service = connections.promise();

module.exports = { Service, affairsConn };
