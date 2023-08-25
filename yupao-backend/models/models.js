const { DataTypes } = require('sequelize')
const sequelize = require('./index')

/**
 * 返回一系列模型
 */
module.exports = {
    // 用户模型
    User: sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            // 在数据库表中的名字,不推荐驼峰
            // field: 'id',
            comment: 'id'
        },
        profile: {
            type: DataTypes.STRING(512),
            allowNull: true,
            comment: '用户简介'
        },
        username: {
            type: DataTypes.STRING,
            // field: 'user_name',
            comment: '用户昵称'
        },
        userAccount: {
            type: DataTypes.STRING,
            // field: 'user_account',
            comment: '用户账号'
        },
        avatarUrl: {
            type: DataTypes.STRING(1024),
            // field: 'avatar_url',
            comment: '用户头像'
        },
        gender: {
            type: DataTypes.TINYINT,
            // field: 'gender',
            comment: '性别'
        },
        userPassword: {
            type: DataTypes.STRING(512),
            // field: 'user_password',
            allowNull: false,
            comment: '密码'
        },
        phone: {
            type: DataTypes.STRING(128),
            // field: 'phone',
            comment: '电话'
        },
        email: {
            type: DataTypes.STRING(512),
            // field: 'email',
            comment: '邮箱'
        },
        userStatus: {
            type: DataTypes.INTEGER,
            // field: 'user_status',
            allowNull: false,
            defaultValue: 0,
            comment: '状态 0 - 正常'
        },
        userRole: {
            type: DataTypes.INTEGER,
            // field: 'user_role',
            allowNull: false,
            defaultValue: 0,
            comment: '用户角色 0 - 普通用户 1 - 管理员'
        },
        planetCode: {
            type: DataTypes.STRING(512),
            // field: 'planet_code',
            comment: '星球编号'
        },
        isDelete: {
            type: DataTypes.TINYINT,
            // field: 'is_delete',
            allowNull: false,
            defaultValue: 0,
            comment: '是否删除'
        },
        createTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            // field: 'create_time',
            comment: '创建时间'
        },
        updateTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            // field: 'update_time',
            comment: '更新时间'
        },
        tags: {
            type: DataTypes.STRING(1024),
            allowNull: true,
            comment: '标签'
        }
    }, {
        // 表名默认为模型名的复数
        tableName: 'Users',
        // sequelize默认为每个模型设置createdAt和updatedAt两个时间戮，但只限于使用sequelize，直接使用sql不会改变这两个字段
        timestamps: true,
        // 重命名
        createdAt: 'createTime',
        updatedAt: 'updateTime',
        // 逻辑删除，通过paranoid进行设置，可以通过deletedAt自定义名称
        // 加上逻辑删除，查询时出现恶心的bug，查询结果一直为null
        // paranoid: true,
        // deletedAt: 'isDelete',
        comment: '用户表'
    }),
    // 标签模型
    Tag: sequelize.define('Tag', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            comment: 'id'
        },
        tagName: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '标签名'
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            comment: '用户id'
        },
        parentId: {
            type: DataTypes.BIGINT,
            allowNull: true,
            comment: '父标签id'
        },
        isParent: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
            comment: '是否为父标签，默认为0不是'
        },
        isDelete: {
            type: DataTypes.TINYINT,
            // field: 'is_delete',
            allowNull: false,
            defaultValue: 0,
            comment: '是否删除'
        },
        createTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            // field: 'create_time',
            comment: '创建时间'
        },
        updateTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            // field: 'update_time',
            comment: '更新时间'
        }
    }, {
        // 添加索引
        indexes: [
            {
                // 索引名
                name: 'unidx_tagName',
                // 是否为唯一索引
                unique: true,
                // 在tagName列上创建索引
                fields: ['tagName']
            }, {
                name: 'idx_userId',
                fields: ['userId']
            }
        ],
        tableName: 'Tags',
        timestamps: true,
        // 重命名
        createdAt: 'createTime',
        updatedAt: 'updateTime',
        comment: '标签表'
    }),
    // 队伍模型
    Team: sequelize.define('Team', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            comment: '队伍id'
        },
        name: {
            type: DataTypes.STRING,
            comment: '队伍名称'
        },
        description: {
            type: DataTypes.STRING(1024),
            allowNull: true,
            comment: '队伍描述'
        },
        maxNum: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
            comment: '队伍最大人数'
        },
        expireTime: {
            type: DataTypes.DATE,
            comment: '过期时间'
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false,
            comment: '创建人id'
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            comment: '队伍状态 0-公开 1-私有 2-加密'
        },
        password: {
            type: DataTypes.STRING(512),
            allowNull: true,
            comment: '队伍密码'
        },
        createTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: '创建时间'
        },
        updateTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: '更新时间'
        },
        isDelete: {
            type: DataTypes.TINYINT,
            allowNull: false,
            defaultValue: 0,
            comment: '是否删除'
        }
    }, {
        tableName: 'Teams',
        timestamps: true,
        createdAt: 'createTime',
        updatedAt: 'updateTime',
        comment: '队伍表'
    }),
    // 用户-队伍关系模型
    Team_User: sequelize.define('Team_User', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            comment: 'id'
        },
        userId: {
            type: DataTypes.BIGINT,
            comment: '用户id'
        },
        teamId: {
            type: DataTypes.BIGINT,
            comment: '队伍id'
        },
        joinTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: '加入时间'
        },
        createTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: '创建时间'
        },
        updateTime: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            comment: '更新时间'
        },
        isDelete: {
            type: DataTypes.TINYINT,
            defaultValue: false,
            allowNull: false,
            comment: '是否删除'
        }
    }, {
        tableName: 'Team_User',
        timestamps: true,
        createdAt: 'createTime',
        updatedAt: 'updateTime',
        comment: '用户-队伍关系表'
    })
}
// 建立表连接
sequelize.models['Team'].belongsToMany(sequelize.models['User'], {
    through: 'Team_User'
})
sequelize.models['User'].belongsToMany(sequelize.models['Team'], {
    through: 'Team_User'
})
// 保持模型与数据库表同步
/*
sequelize.models['Team_User'].sync({ alter: true }).then(() => {
    console.log('与数据库完成同步');
})
*/
// sequelize.sync();







