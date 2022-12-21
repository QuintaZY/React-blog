require('dotenv').config({path: '../../.env'})

const jwt = require('jsonwebtoken')

// 加签，生成令牌
const sign = async (username,email) => {
	return new Promise((resolve, reject) => {
		jwt.sign({
			username,
			email
		}, process.env.JWT_SECRET, (err, token) => {
			if (err) {
				return reject(err)
			}
			resolve(token)
		})
	})
}
// 解签，验证令牌
const decode = async (token) => {
	return new Promise((resolve, reject) => {
		jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
			if (err) {
				return reject(err)
			}
			console.log('这是返回的解签', decoded)
			resolve(decoded)
		})
	})
}
module.exports = {sign,decode}
// module.exports = decoded

// const test = async () => {
// 	const data = {
// 		username: 'admin',
// 		email: "admin@qq.com"
// 	}
// 	const {username ,email} = data
// 	const token = await sign(username,email)
// 	const decoded = await decode(token)
// 	console.log(token, decoded)
// }
// test()