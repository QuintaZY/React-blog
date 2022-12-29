require('dotenv').config({path: '.env'})
const initDB = require('./src/init/initDB')
const initServer = require('./src/init/initServer')
const initRoute = require('./src/init/initRoute')
const cors = require('cors')
const morgan = require('morgan')
const noMatchMiddleware = require('./src/middleware/404.middleware')
const errorMiddleware = require('./src/middleware/error.middleware')

const express = require('express')
const app = express()
// 中间件
app.use(cors({credential: true, origin: true})) // 跨域
app.use(express.json()) // 解析json 数据
app.use(morgan('tiny')) // http 日志

// 静态服务
app.use('/static',express.static('pubilc'))
// 路由
initRoute(app)
// 404
app.use(noMatchMiddleware)
// 统一错误处理
app.use(errorMiddleware)

const main = async () => {
	// 初始化数据库服务
	await initDB()
	// 服务器
	await initServer(app)
}
main()