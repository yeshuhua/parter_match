/**
 * 测试导入不同数据量（1000000）数据耗时
 */
const Mappers = require('../services/cate/completion');

const INSERT_NUM = 100000;
let insert_value = [];
console.time();
for (let i = 0; i < INSERT_NUM; i++) {
    const safetyUser = {
        username: "butter_name_" + i,
        userAccount: "man_man_man",
        avatarUrl: "https://img0.baidu.com/it/u=3256587095,2532595735&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        gender: 1,
        userPassword: "12345678",
        phone: "12345",
        email: "result@qq.com",
        userStatus: 0,
        userRole: 0,
        planetCode: "3208",
        tags: "[]"
    }
    // insert_value.push(safetyUser);
}
// Mappers.User.userAddMany(insert_value);
console.timeEnd();