require('dotenv').config({path: '.env'})
const initDB = require('./src/init/initDB')
const initServer = require('./src/init/initServer')
const initRoute = require('./src/init/initRoute')
const cors = require('cors')
const morgan = require('morgan')

const express = require('express')
const app = express()
// 中间件
app.use(cors({credential: true, origin: true})) // 跨域
app.use(express.json()) // 解析json 数据
app.use(morgan('tiny')) // http 日志
// 路由
initRoute(app)

const main = async () => {
	// 初始化数据库服务
	await initDB()
	// 服务器
	await initServer(app)
}
main()