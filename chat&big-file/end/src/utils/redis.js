const redis = require("redis");

//实例
const client = redis.createClient("6379");

//连接错误处理
client.on("error", (err) => {
  console.log("Redis connection failed:", err);
});

//连接成功
client.on("connect", () => {
  console.log("Redis connection successful!");
});

//验证redis
// client.auth('123456');

//redis助手
class redisHelper {
  /**
   *
   * @param {*} key 键
   * @param {*} value 值
   * @param {*} expire 有效时间
   * @returns
   */
  setString(key, value, expire) {
    return new Promise((resolve, reject) => {
      client.set(key, value, (err, result) => {
        if (err) {
          console.log("Failed to set Redis:", err);
          reject(err);
        }
        if (!isNaN(expire) && expire > 0) {
          client.expire(key, parseInt(expire));
        }
        resolve(result);
      });
    });
  }
  /**
   *
   * @param {*} key 键
   * @returns 值
   */
  getString(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (err, result) => {
        if (err) {
          console.log("Failed to get Redis:", err);
          reject(err);
        }
        resolve(result);
      });
    });
  }
}

module.exports = new redisHelper();
