const { DataTypes } = require('sequelize')
const sequelize = require('../db/sequelize')

const User = sequelize.define('users',{
	email: { // 邮箱
		type: DataTypes.STRING,
		allowNull: false,
		// 是否主键
		primaryKey:true
	},
	username: { // 用户名
		type: DataTypes.STRING,
		allowNull: false,
		// 唯一
		unique:'username'
	},
	password: { // 密码
		type: DataTypes.STRING,
		allowNull: false,
		// 唯一
		unique:true
	},
	avatar: { // 头像
		type: DataTypes.TEXT,
		allowNull: true
	},
	bio: { // 简介
		type: DataTypes.TEXT,
		allowNull: true
	}
})

module.exports = User