/**
 * 后端统一返回工具
 */

const CodeEnum = require('./CodeEnum')
module.exports = class BaseBack {
    constructor({ code, data, message, description }) {
        this.code = code
        this.message = message
        this.data = data
        this.description = description
    }

    /**
     * 静态方法只能通过类使用
     * 请求成功，只返回code
     */
    static buildSuccess() {
        return new BaseBack({ ...CodeEnum.SUCCESS, data: null }).toJson()
    }

    /**
     * 请求成功，返回code+data
     */
    static buildCodeAndData(data) {
        return new BaseBack({ ...CodeEnum.SUCCESS, data }).toJson()
    }

    /**
     * 请求失败，只返回code+message
     */
    static buildError(msg) {
        return new BaseBack({ code: -1, data: null, message: msg, description: null }).toJson()
    }

    /**
     * 请求失败，自定义返回code+message，默认description为空
     */
    static buildResult(codeEnum) {
        return new BaseBack({ data: null, description: null, ...codeEnum }).toJson()
    }

    toJson() {
        return {
            code: this.code,
            data: this.data,
            message: this.message,
            description: this.description
        }
    }
}