/**
 * 数据库处理文件
 */
// 导入第三方包
const { Sequelize } = require('sequelize')
// 数据库配置文件
const db_config = require('../config/mysql')

// 创建连接实例
const sequelize = new Sequelize(
    db_config.database,
    db_config.user,
    db_config.pass, {
    host: db_config.host,
    dialect: db_config.dialect,
    port: db_config.port,
    pool: db_config.pool
});

// 测试是否连接成功
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(error => {
    console.error('Unable to connect to the database:', error);
})
module.exports = sequelize