//实例化
const {Sequelize} = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
	host: process.env.DB_HOST,
	dialect: process.env.DB_DIALECT,
	port: process.env.DB_PORT,
	logging: false
})

module.exports = sequelize