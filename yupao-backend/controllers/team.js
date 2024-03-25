const Mappers = require('../services/cate/completion')
const { Op, json } = require('sequelize');
const sequelize = require('../models/index');

// 引入自己封装的后端统一返回工具
const BaseBack = require('../config/resultUtils')
// 自定义错误码
const CodeEnum = require('../config/CodeEnum')
// 队伍状态值
const TeamStatusEnum = require('../config/TeamStatusEnum');
const { User } = require('../models/models');
const TeamStatus = [TeamStatusEnum.PRIVATE.value, TeamStatusEnum.PUBLIC.value, TeamStatusEnum.SECRET.value]

module.exports = {
    // 创建队伍
    teamAdd: async (req, res) => {
        const { maxNum, name, description, status, password, expireTime, userId } = req.body
        // 请求参数为空
        if (!req.body) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR))
        // 未登录
        if (!req.session.isLogin) return res.json(BaseBack.buildResult(CodeEnum.NOT_LOGIN))
        // 队伍人数1<=maxNum<=20
        if (maxNum < 1 || maxNum > 20) {
            return res.json(BaseBack.buildError('队伍人数不符合要求'))
        }
        if (name === null || name > 20) {
            return res.json(BaseBack.buildError('队伍标题不满足要求'))
        }
        if (description === null || description > 512) {
            return res.json(BaseBack.buildError('队伍描述过长'))
        }
        // 注意类型转换
        // console.log(typeof status);
        if (!TeamStatus.includes(status - 0)) {
            return res.json(BaseBack.buildError('非法的队伍状态'))
        }
        // 创建的是加密队伍但是没有设置队伍密码
        if (status == TeamStatusEnum.SECRET.value && (password == "" || password.length > 32)) {
            return res.json(BaseBack.buildError('密码设置有误'))
        }
        // console.log(new Date(expireTime).getTime());
        // 超时时间在当前时间之前
        if (new Date(expireTime).valueOf() < (new Date()).valueOf()) {
            return res.json(BaseBack.buildError('超时时间早于当前时间'))
        }
        const num = await Mappers.Team.teamUserCount({
            where: {
                userId: userId
            }
        })
        if (num >= 5) return res.json(BaseBack.buildError('用户最多创建5个队伍'))
        // 向两个表中插入数据，注意原子性，不能一个成功一个失败，可以开启mysql事务
        // 这里未作事务处理
        // 首先,我们开始一个事务并将其保存到变量中
        // console.log(JSON.stringify(req.body));
        const t = await sequelize.transaction();
        try {
            const team = await Mappers.Team.teamAdd({ ...req.body, transaction: t });
            await Mappers.Team.teamUserAdd({
                userId: userId,
                teamId: team.id,
                transaction: t
            })
            // 如果执行到此行,且没有引发任何错误.
            // 我们提交事务.
            await t.commit();
            return res.json(BaseBack.buildSuccess())
        } catch (error) {


            // 如果执行到达此行,则抛出错误.
            // 我们回滚事务.
            await t.rollback();
            return res.json(BaseBack.buildResult(CodeEnum.SYSTEM_ERROR))
        }
        // const result = await Mappers.Team.teamAdd(req.body)
        // const result1 = await Mappers.Team.teamUserAdd({
        //     userId: userId,
        //     teamId: result.id
        // })
        // if (result && result1) {
        //     return res.json(BaseBack.buildSuccess())
        // }

    },
    // 退出队伍
    teamQuit: async (req, res) => {
        const { teamId } = req.body;
        const { userId } = req.session.user;
        if (!req.body) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR));
        if (teamId == null || teamId <= 0) {
            return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR));
        }
        // 查找队伍是否存在
        const team = await Mappers.Team.teamFindOne({
            where: {
                id: teamId
            }
        })
        if (team == null) return res.json(BaseBack.buildError('队伍不存在'));
        // 查询是否在当前队伍
        const count = await Mappers.Team.teamUserCount({
            where: {
                teamId, userId
            }
        })
        if (count == 0) return res.json(BaseBack.buildError('未加入该队伍'));
        // 查询当前队伍人数
        const teamHasJoinNum = await Mappers.Team.teamUserCount({
            where: {
                teamId
            }
        })
        // 队伍只有一人
        if (teamHasJoinNum == 1) {
            const t = await sequelize.transaction();
            try {
                // 队伍解散，同时删除队伍以及所有加入队伍的关系。
                // 删除Team中队伍，Team_User关联表中对应的Team相关的数据也会自动删除。
                await Mappers.Team.teamDelete({
                    where: {
                        id: teamId - 0
                    },
                    transaction: t
                })
                await Mappers.Team.teamUserDelete({
                    where: {
                        teamId,
                        userId
                    },
                    transaction: t
                })
                await t.commit();
                return res.json(BaseBack.buildSuccess());
            } catch {
                await t.rollback();
                return res.json(BaseBack.buildError('退出失败'));
            }

            // let result1 = await Mappers.Team.teamDelete({
            //     where: {
            //         id: teamId - 0
            //     }
            // })
            /*
            let result2 = await Mappers.Team.teamUserDelete({
                where: {
                    teamId: teamId - 0
                }
            })
            */
            if (result1) return res.json(BaseBack.buildSuccess());
            return res.json(BaseBack.buildError('退出失败'));
        } else {
            // 判断是否为队长，是则转移队长，不是直接退出
            if (team.userId === userId) {
                // 查询已加入队伍的用户和加入时间，只需查询最早加入的两条数据
                let result = await Mappers.Team.teamUserFindAll({
                    order: [
                        ['id']
                    ],
                    limit: 2,
                    where: {
                        teamId
                    }
                })
                // 数据为空或没有两条数据
                if (result == null || result.length <= 1) {
                    return res.json(BaseBack.buildResult(CodeEnum.SYSTEM_ERROR));
                }
                // 将队长转移给第二条数据
                let newCapId = result[1].userId;
                const updateResult = await Mappers.Team.teamUpdate({
                    where: {
                        id: teamId
                    }
                }, {
                    userId: newCapId
                })
                if (!updateResult) return res.json(BaseBack.buildError('更新队长失败'));
                let result2 = await Mappers.Team.teamUserDelete({
                    where: {
                        teamId,
                        userId
                    }
                })
                if (!result2) return res.json(BaseBack.buildError('队长信息移除失败'));
                return res.json(BaseBack.buildSuccess());
            } else {
                // 不是队长
                let result = await Mappers.Team.teamUserDelete({
                    where: {
                        teamId,
                        userId
                    }
                })
                if (!result) return res.json(BaseBack.buildError('退出队伍失败'));
                return res.json(BaseBack.buildSuccess());
            }
        }

    },
    // 修改队伍信息
    teamUpdate: async (req, res) => {
        if (!req.body) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR));
        const { id, status, password } = req.body;
        if (!req.session.isLogin) return res.json(BaseBack.buildResult(CodeEnum.NOT_LOGIN));
        const { userId, userRole } = req.session.user
        if (!id || id <= 0) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR));
        const result = await Mappers.Team.teamFindOne({
            where: {
                id
            }
        })
        // 传入的队伍ID查询不到相应的数据
        if (!result) return res.json(BaseBack.buildResult(CodeEnum.NULL_ERROR))
        // 不是当前队伍的创建者同时也不是管理员
        if (userId !== result.userId && userRole !== 1) {
            return res.json(BaseBack.buildResult(CodeEnum.NO_AUTH))
        }
        // 改为加密房间需要传递密码
        if (result.status !== TeamStatusEnum.SECRET.value && status == TeamStatusEnum.SECRET.value && password == "") {
            return res.json(BaseBack.buildError('设置为加密房间需要密码'));
        }
        for (let key in req.body) {
            if (!req.body[key]) {
                delete req.body[key];
            }
        }
        const updateResult = await Mappers.Team.teamUpdate({
            where: {
                id
            }
        }, req.body)
        if (updateResult) {
            return res.json(BaseBack.buildSuccess());
        }
        return res.json(BaseBack.buildError('更新失败'));
    },
    // 查询当前用户创建的队伍
    teamSearchByUserId: async (req, res) => {
        if (!req.session.isLogin) return res.json(BaseBack.buildResult(CodeEnum.NOT_LOGIN));
        const { userId } = req.session.user;
        if (userId == null || userId <= 0) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR));
        const result = await Mappers.Team.teamFindAll({
            where: {
                userId: userId
            },
            attributes: { exclude: ['password', 'updateTime', 'isDelete'] },
            // 关联查询语法
            include: {
                model: User,
                // 移除不需要获取的属性
                attributes: {
                    exclude: ['userPassword', 'createTime', 'updateTime', 'isDelete']
                },
                // 作用是不获取连接表中的任何内容
                through: {
                    attributes: []
                }
            }
        })
        if (!result) return res.json(BaseBack.buildResult(CodeEnum.NULL_ERROR));
        return res.json(BaseBack.buildCodeAndData(result));
    },
    // 查看用户已加入的队伍
    teamHasJoin: async (req, res, next) => {
        if (!req.session.isLogin) return res.json(BaseBack.buildResult(CodeEnum.NOT_LOGIN));
        const { userId } = req.session.user;
        if (userId == null || userId <= 0) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR));
        const result = await Mappers.Team.teamUserFindAll({
            where: {
                userId
            }
        })
        if (!result) return res.json(BaseBack.buildResult(CodeEnum.NULL_ERROR));
        return res.json(BaseBack.buildCodeAndData(result));
    },
    // 条件查询用户列表
    teamList: async (req, res) => {
        const { id, maxNum, name, description, status, expireTime, userId, searchText, ids } = req.query;
        let QueryInfo = {
            id: '',
            maxNum: '',
            name: '',
            description: '',
            status: '',
            // expireTime: '',
            userId: ''
        }
        if (!req.session.isLogin) return res.json(BaseBack.buildResult(CodeEnum.NOT_LOGIN));
        // 根据id查找队伍
        if (id && id > 0) {
            QueryInfo = {
                ...QueryInfo,
                id
            }
        }
        // 名字中包含关键词
        if (name) {
            QueryInfo = {
                ...QueryInfo,
                name: {
                    [Op.like]: `%${name}%`
                }
            }
        }
        if (ids != null && ids.length > 0) {
            QueryInfo = {
                ...QueryInfo,
                id: JSON.parse(ids)
            }
        }
        // 介绍中包含关键词
        if (description) {
            QueryInfo = {
                ...QueryInfo,
                description: {
                    [Op.like]: `%${description}%`
                }
            }
        }
        if (maxNum && maxNum > 0) {
            QueryInfo = {
                ...QueryInfo,
                maxNum: {
                    [Op.lte]: maxNum
                }
            }
        }
        if (status && status > -1) {
            QueryInfo = {
                ...QueryInfo,
                status
            }
        }
        if (userId && userId > 0) {
            QueryInfo = {
                ...QueryInfo,
                userId
            }
        }
        if (searchText) {
            QueryInfo = {
                [Op.or]: {
                    name: {
                        [Op.like]: `%${searchText}%`
                    },
                    description: {
                        [Op.like]: `%${searchText}%`
                    }
                }
            }
        }
        if (!req.session.isLogin && status !== TeamStatusEnum.PUBLIC.value) {
            return res.json(BaseBack.buildResult(CodeEnum.NO_AUTH));
        }
        if (expireTime == null || new Date(expireTime).valueOf() > (new Date()).valueOf()) {
            QueryInfo = {
                ...QueryInfo,
                expireTime: {
                    [Op.gt]: expireTime == null ? new Date(1900, 1, 1) : new Date(expireTime)
                }
            }
        }

        // 条件为空的属性删除，避免查询时查找某属性要求条件为空
        for (let key in QueryInfo) {
            if (QueryInfo[key] == '') {
                delete QueryInfo[key];
            }
        }
        let teamsData = await Mappers.Team.teamFindAll({
            where: QueryInfo,
            attributes: { exclude: ['password', 'updateTime', 'isDelete'] },
            // 关联查询语法
            include: {
                model: User,
                // 移除不需要获取的属性
                attributes: {
                    exclude: ['userPassword', 'createTime', 'updateTime', 'isDelete']
                },
                // 作用是不获取连接表中的任何内容
                through: {
                    attributes: []
                }
            }
        })
        if (teamsData) {
            return res.json(BaseBack.buildCodeAndData(teamsData));
        }

    },
    teamListPagination: async (req, res) => {

    },
    // 加入队伍
    teamJoin: async (req, res, next) => {
        if (!req.body) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR));
        const { teamId, password } = req.body;
        if (!req.session.isLogin) return res.json(BaseBack.buildResult(CodeEnum.NOT_LOGIN));
        const { userId } = req.session.user;
        if (teamId == null || teamId <= 0) {
            return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR));
        }
        // 查看队伍中是否已有该用户
        const isJoin = await Mappers.Team.teamUserCount({
            where: {
                userId,
                teamId
            }
        })
        if (isJoin && isJoin > 0) {
            return res.json(BaseBack.buildError('不能重复加入队伍'));
        }

        const team = await Mappers.Team.teamFindOne({
            where: {
                id: teamId
            }
        })
        if (!team) return res.json(BaseBack.buildError('队伍不存在'));
        if (team.expireTime !== null && new Date(team.expireTime) < new Date()) {
            return res.json(BaseBack.buildError('队伍已过期'));
        }
        if (team.status == TeamStatusEnum.PRIVATE.value) {
            return res.json(BaseBack.buildError('私人队伍无法加入'));
        }
        if (team.status == TeamStatusEnum.SECRET.value && (!password || password != team.password)) {
            return res.json(BaseBack.buildError('队伍密码错误'));
        }
        // 查询用户已创建和加入的队伍数量
        const hasJoinNum = await Mappers.Team.teamUserCount({
            where: {
                userId
            }
        })
        if (hasJoinNum >= 5) {
            return res.json(BaseBack.buildError('用户最多创建和加入5个队伍'));
        }
        // 查询队伍已加入人数
        const teamHasJoin = await Mappers.Team.teamUserCount({
            where: {
                teamId
            }
        })
        if (teamHasJoin && teamHasJoin > team.maxNum) {
            res.json(BaseBack.buildError('队伍已满'));
        }
        // 往队伍-用户关系表中新增信息
        const result = await Mappers.Team.teamUserAdd({
            userId,
            teamId,
            joinTime: new Date()
        })
        if (result) {
            return res.json(BaseBack.buildSuccess());
        }
    },
    // 解散队伍
    teamDelete: async (req, res, next) => {
        const { teamId } = req.body;
        const { userId } = req.session.user;
        if (!req.body) return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR));
        if (teamId == null || teamId <= 0) {
            return res.json(BaseBack.buildResult(CodeEnum.PARAMS_ERROR));
        }
        // 查找队伍是否存在
        const team = await Mappers.Team.teamFindOne({
            where: {
                id: teamId
            }
        })
        if (team == null) return res.json(BaseBack.buildError('队伍不存在'));
        // 不是当前队伍的队长
        if (team.userId != userId) return res.json(BaseBack.buildResult(CodeEnum.NO_AUTH));
        const t = await sequelize.transaction();
        try {
            // 队伍表删除队伍
            await Mappers.Team.teamDelete({
                where: {
                    id: teamId
                },
                transaction: t
            })
            // 队伍关系表删除所有用户与该队伍的关系
            await Mappers.Team.teamUserDelete({
                where: {
                    teamId
                },
                transaction: t
            })
            await t.commit();
            return res.json(BaseBack.buildSuccess());
        } catch {
            await t.rollback();
            return res.json(BaseBack.buildError('删除队伍相关信息失败'));
        }

        // const result = await Mappers.Team.teamDelete({
        //     where: {
        //         id: teamId
        //     }
        // })
        // if (!result) return res.json(BaseBack.buildError('删除队伍相关信息失败'));
        // return res.json(BaseBack.buildSuccess());
    }
}