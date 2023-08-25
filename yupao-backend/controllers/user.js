// 模型方法代理对象
const Mappers = require('../services/cate/completion')
// 引入校验模块
const Joi = require('joi')
// 引入jsonwebtoken模块生成toekn
// const jwt = require('jsonwebtoken')
// qs库
const qs = require("qs")


// 引入自己封装的后端统一返回工具
const BaseBack = require('../config/resultUtils')
// 自定义错误码
const CodeEnum = require('../config/CodeEnum')

// 加密盐
// const secretKey = require('../constants/index').secretKey

// 注册请求体的校验规则
const registerSchema = Joi.object({
    userAccount: Joi.string().min(4).required().error(new Error('账号长度必须大于4位')),
    userPassword: Joi.string().min(8).required().error(new Error('密码长度不小于8位')),
    checkPassword: Joi.string().min(8).required().error(new Error('密码长度不小于8位')),
    planetCode: Joi.string().min(1).max(6).required().error(new Error('请输入1~6位星球编号'))
})

// 登录请求体的校验规则
const loginSchema = Joi.object({
    userAccount: Joi.string().min(4).required().error(new Error('账号长度必须大于4位')),
    userPassword: Joi.string().min(8).required().error(new Error('密码长度不小于8位')),
    autoLogin: Joi.boolean(),
    type: Joi.string().default('account')
})

module.exports = {
    // 注册
    register: async (req, res) => {
        // Joi模块校验表单数据的方法
        const { error } = registerSchema.validate(req.body)
        const { userPassword, checkPassword, userAccount, planetCode } = req.body
        // console.log(req.body);
        // 校验没错
        if (!error) {
            // 两次输入密码必须相同
            if (userPassword.trim() !== checkPassword.trim()) {
                return res.json(BaseBack.buildError('两次输入密码不同'))
            }
            // 查询数据库是否有相同账号的用户
            const user = await Mappers.User.userFindOne({
                where: {
                    userAccount: userAccount
                }
            })
            // console.log(user);

            if (!user) {
                // 不存在相同账号的用户，则向数据库中插入新数据
                // 密码加密，使用的是bcrypt模块。由于环境配置出现问题，这里没有加密
                const newUser = await Mappers.User.userAdd(req.body)
                // console.log(newUser.planetCode);
                res.json(BaseBack.buildCodeAndData(newUser.planetCode))
            } else {
                if (user.planetCode === planetCode) {
                    return res.json(BaseBack.buildError('该星球编号已注册过账号'))
                }
                return res.json(BaseBack.buildError('该用户名已被使用'))
            }
        }
    },
    // 登录
    login: async (req, res) => {
        const { error } = loginSchema.validate(req.body)
        if (!error) {
            const { userAccount, userPassword } = req.body

            // 根据用户账号查找用户
            const result = await Mappers.User.userFindOne({
                where: {
                    userAccount: userAccount
                }
            })
            if (!result) {
                // 该账号不存在
                return res.json(BaseBack.buildError('账号不存在'))
            }
            // 需要保存的状态信息
            const playload = {
                username: userAccount,
                userId: result.id,
                userRole: result.userRole
            }
            // 本来密码加密的话，需要解密再进行比较

            if (result.userPassword === userPassword) {
                req.session.user = playload
                req.session.isLogin = true
                // 使用token的缺点是服务器端无法手动注销token的过期，即使在客户端本地location中删除，只要未过期，token依旧可用
                // const token = jwt.sign(playload, secretKey, { expiresIn: '1d' })
                // 将token响应给客户端
                return res.json(BaseBack.buildCodeAndData({
                    status: 'ok',
                    type: 'account',
                    currentAuthority: 'success'
                }))

            } else {
                return res.json(BaseBack.buildError('账号或密码错误'));
            }
        }
        return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR))
    },
    // 返回当前用户信息
    current: async (req, res, next) => {
        // console.log(req.session.isLogin);
        // console.log(req.session.user);
        if (!req.session.isLogin) return res.json(BaseBack.buildResult(CodeEnum.NOT_LOGIN))
        const userId = req.session.user.userId
        if (userId > 0) {
            const result = await Mappers.User.userFindOne({
                where: {
                    id: userId
                }
            }, {
                raw: true
            })
            // 用户脱敏
            const safetyUser = {
                id: result.id,
                username: result.username,
                userAccount: result.userAccount,
                avatarUrl: result.avatarUrl,
                gender: result.gender,
                phone: result.phone,
                email: result.email,
                userStatus: result.userStatus,
                createTime: result.createTime,
                userRole: result.userRole,
                planetCode: result.planetCode
            }
            return res.json(BaseBack.buildCodeAndData(safetyUser))
        } else {
            return res.json(BaseBack.buildError('请先登录'))
        }

    },
    // 退出登录
    logout: (req, res, next) => {
        req.session.user = null
        req.session.isLogin = false
        // 使用token的话，只能在前端本地存储中清除token
        return res.json(BaseBack.buildCodeAndData(200))
    },
    // 根据标签搜索用户
    searchUsersByTags: async (req, res, next) => {
        // 请求参数传过来为空，不查询，不返回结果
        let tagList = qs.parse(req.query).tagNameList
        // 当数组只有一个元素时，qs.parse不会转换回数组，而是元素本来的值 ["男"] ->"男"
        tagList = (typeof tagList) === "string" ? [tagList] : tagList
        // console.log(tagList);
        if (tagList.length === 0) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR))
        // 查询方式
        // 1.可以选择sql查询，通过模糊匹配 like "%java%"之类的语句判断用户有无该标签
        // 2.直接获取所有数据，然后反序列化后即从json变为对象，通过filter之类的函数过滤返回含有需要标签的用户数据
        const result = await Mappers.User.userFindAll()

        // 获取用户列表为空
        if (result.length === 0) {
            return res.json(BaseBack.buildError('暂无数据'));
        }
        // console.log(result);
        let filterResult = result.filter(user => {
            let flag = false;
            tagList.forEach(tag => {
                if (user.tags && JSON.parse(user.tags).includes(tag)) {
                    flag = true
                }
            })
            return flag
        })
        if (filterResult.length === 0) return res.json(BaseBack.buildError('暂无符合的数据'))
        filterResult = filterResult.map(user => {
            return {
                id: user.id,
                username: user.username,
                userAccount: user.userAccount,
                avatarUrl: user.avatarUrl,
                gender: user.gender,
                phone: user.phone,
                email: user.email,
                userStatus: user.userStatus,
                createTime: user.createTime,
                userRole: user.userRole,
                planetCode: user.planetCode,
                tags: JSON.parse(user.tags)
            }
        })
        return res.json(BaseBack.buildCodeAndData(filterResult))
    },
    // 修改用户信息
    updateUser: async (req, res, next) => {
        if (!req.session.isLogin) return res.json(BaseBack.buildResult(CodeEnum.NOT_LOGIN))
        const { id, updateObj: [key, value] } = req.body
        // console.log(req.body);
        const { userRole, userId } = req.session.user
        if (id < 0) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR))
        // 管理员允许修改所有用户, 普通用户只能修改自身信息
        if (!userRole == 1 && id !== userId) {
            return res.json(BaseBack.buildResult(CodeEnum.NO_AUTH))
        }
        const result = await Mappers.User.userUpdate({
            // 查询条件
            where: {
                id: id
            }
        }, {
            [key]: value
        })
        if (result) return res.json(BaseBack.buildCodeAndData('修改成功'))
    },
    // 用户推荐
    userRecommend: async (req, res, next) => {
        if (!req.query) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR))
        const { pageSize, pageNum } = req.query
        // console.log(pageSize);
        // console.log(pageNum);
        const result = await Mappers.User.userFindAll({
            limit: pageSize - 0,
            offset: (pageNum - 1) * pageSize
        })
        if (!result) return res.json(BaseBack.buildError('暂无数据'));
        const filterResult = result.map(item => {
            return {
                id: item.id,
                username: item.username,
                userAccount: item.userAccount,
                avatarUrl: item.avatarUrl,
                gender: item.gender,
                phone: item.phone,
                email: item.email,
                userStatus: item.userStatus,
                createTime: item.createTime,
                userRole: item.userRole,
                planetCode: item.planetCode
            }
        })
        return res.json(BaseBack.buildCodeAndData(filterResult))
    }
}