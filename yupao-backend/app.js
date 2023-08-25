/**
*   项目启动文件
*/

const path = require('path')
// 导入express框架
const express = require('express')
// 日志处理第三方包
const logger = require('morgan')

// 常量文件
const constants = require('./constants')
// 引入路由对象
const userRouter = require('./routes/user')
const teamRouter = require('./routes/team')
const cors = require('cors')
const sequelize = require('./models/index')
// express-jwt中间件用于将客户端发送过来的token字符串，解析还原成对象并挂载到req.auth上
// const { expressjwt } = require('express-jwt')
const session = require('express-session')

// 创建服务器实例
const app = express()

// 跨域相关配置
let corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: "GET,POST,DELETE,PUT,OPTIONS",
    allowedHeaders: ["Content-Type"],
    credentials: true
}
// 跨域
app.use(cors(corsOptions))
// unless作用是指明/api/开头的都不用处理
// app.use(expressjwt({ secret: constants.secretKey, algorithms: ["HS256"] }).unless({ path: [/^\/api\//] }))
app.use(session({
    secret: "secret yeshuhua",
    resave: false,
    saveUninitialized: true,  // 不需要登录，在第一次创建会话时就保存sessionId
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1d过期时间
        // 还可以在这里设置一些sameSite,expire之类的属性
    }
}))

// body请求参数处理
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// 静态文件托管到public文件夹中
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', userRouter)
app.use('/api', teamRouter)

/**
 * dev格式为:method :url :status :response-time ms - :res[content-length]
 */
app.use(logger('dev'))

// 全局错误处理
app.use((err, req, res, next) => {
    res.status(500).send('something broke...')
})

app.listen(constants.port, () => {
    console.log(`server running at port ------${constants.port} ovo`);
})