require('dotenv').config({path: '.env'})
const initDB = require('./src/init/initDB')
const initServer = require('./src/init/initServer')
const initRoute = require('./src/init/initRoute')
const cors = require('cors')
const express = require('express')
const app = express()
// 中间件
app.use(cors) // 跨域
app.use(express.json) // 解析json 数据

// 路由
initRoute(app)

const main = async () => {
	// 初始化数据库服务
	await initDB()
	// 服务器
	await initServer(app)
}
main()