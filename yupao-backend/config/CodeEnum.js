/**
 * 自定义的错误返回信息
 */
module.exports = {
    /**
     * 0    请求成功
     */
    SUCCESS: {
        code: 0,
        message: "请求成功",
        description: ""
    },
    /**
     * 40000    参数错误
     */
    PARAMS_ERROR: {
        code: 40000,
        message: "请求参数错误",
        description: ""
    },
    /**
     * 40001    数据为空
     */
    NULL_ERROR: {
        code: 40001,
        message: "请求数据为空",
        description: ""
    },
    /**
     * 40100    未登录
     */
    NOT_LOGIN: {
        code: 40100,
        message: "未登录",
        description: ""
    },
    /**
     * 40101    无权限
     */
    NO_AUTH: {
        code: 40101,
        message: "无权限",
        description: ""
    },
    /**
     * 50000    系统内部异常
     */
    SYSTEM_ERROR: {
        code: 50000,
        message: "系统内部异常",
        description: ""
    }

}