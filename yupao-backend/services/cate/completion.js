/**
 * 实现某个模型具体的数据操作
 */
const BASE_DB_METHOD = require('../index')
const Models = require('../../models/models')

class User extends BASE_DB_METHOD {
    // 添加用户
    async userAdd(obj) {
        return await this.create('User', obj);
    }

    async userAddMany(obj) {
        return await this.bulkCreate('User', obj);
    }

    // 查询单个用户
    async userFindOne(obj) {
        return await this.findOne('User', obj);
    }

    // 查询所有用户
    async userFindAll(obj) {
        return await this.find('User', obj);
    }

    // 更新用户信息
    async userUpdate(condition, obj) {
        return await this.update('User', condition, obj);
    }

    // 逻辑删除用户
    async userDelete(obj) {
        return await this.delete('User', obj);
    }

}

class Team extends BASE_DB_METHOD {
    // 创建队伍
    async teamAdd(obj) {
        // console.log(obj);
        return await this.create('Team', obj);
    }

    // 用户-队伍关系表中创建数据
    async teamUserAdd(obj) {
        return await this.create('Team_User', obj);
    }

    // 删除队伍
    async teamDelete(obj) {
        return await this.delete('Team', obj);
    }

    // 更新队伍信息
    async teamUpdate(condition, obj) {
        return await this.update('Team', condition, obj);
    }

    async teamFindOne(obj) {
        return await this.findOne('Team', obj);
    }

    async teamFindAll(obj) {
        return await this.find('Team', obj);
    }

    async teamUserCount(obj) {
        return await this.count('Team_User', obj);
    }

    async teamUserDelete(obj) {
        return await this.delete('Team_User', obj);
    }

    async teamUserFindAll(obj) {
        return await this.find('Team_User', obj);
    }
}

const Mappers = {
    User,
    Team
}

// 通过创建代理对象将模型的方法实例暴露出去
module.exports = new Proxy({}, {
    get: (_, val) => new Mappers[val],
    set: () => {
        throw new TypeError('装饰器类型 不可以修改')
    }
})