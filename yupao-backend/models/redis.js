// 引入redis客户端
const Redis = require("ioredis");
// 创建实例
const redisClient = new Redis();

module.exports = redisClient