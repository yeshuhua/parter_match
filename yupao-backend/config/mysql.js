module.exports = {
    // 数据库方言
    dialect: 'mysql',
    // 数据库主机地址
    host: 'localhost',
    // 用户名
    user: 'yeshuhua',
    pass: '123456',
    port: 3306,
    database: 'user_center',
    // 是否允许query中写多个查询语句
    multipleStatements: false,
    pool: {
        max: 5, // 连接池中最大连接数量
        min: 0,
        idle: 10000 // 如果一个进程10秒钟没有使用过的话，那么就释放线程
    }
}