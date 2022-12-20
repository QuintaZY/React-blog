// 数据库连接
const sequelize = require('./sequelize.js')

const db = async () => {
	return new Promise(async (resolve,reject) => {
		try {
			await sequelize.authenticate()
			console.log('数据库执行成功,successfully')
			resolve()
		} catch (error) {
			console.error('数据库执行失败,unable to connect', error)
			reject()
		}
	})
}

module.exports = db