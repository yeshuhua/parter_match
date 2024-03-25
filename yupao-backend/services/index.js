/**
 * 将sequelize进行数据库操作的方法定义到一个类里，便于继承拓展
 */
const models = require('../models/index').models
module.exports = class BASE_DB_METHOD {
    /**
     * 创建数据
     * @param {*} name 模型名字
     * @param  {...any} obj 创建的数据内容
     * @returns 
     */
    async create(name, ...obj) {
        // console.log(obj);
        return await models[name].create(obj[0]);
    }

    /**
     * 批量创建数据
     * @param {*} name 模型名字 
     * @param {*} obj 创建的数据内容
     * @returns 
     */
    async bulkCreate(name, obj) {
        return await models[name].bulkCreate(obj);
    }

    /**
     * 查询满足条件的所有数据
     * @param {*} name 模型名
     * @param {*} obj 查询条件
     */
    async find(name, obj) {
        return await models[name].findAll(obj);
    }

    // 返回第一个满足条件的数据
    async findOne(name, obj) {
        return await models[name].findOne(obj);
    }

    /**
     * 更新数据
     * @param {*} name 模型名
     * @param {*} condition 查询条件
     * @param {*} obj 更新的数据
     * @returns 
     */
    async update(name, condition, obj) {
        return await models[name].update(obj, condition);
    }

    // 返回满足条件的数据条数
    async count(name, obj) {
        return await models[name].count(obj);
    }

    // 删除
    async delete(name, obj) {
        return await models[name].destroy(obj);
    }
}