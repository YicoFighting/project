const Redis = require("redis");

const connectRedis = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const client = Redis.createClient();
      await client.connect();
      resolve(client);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = connectRedis;
