const HttpException = require('../../exceptions/http.exception');
const {decode} = require('jsonwebtoken')

module.exports.authMiddleware = async (req, res, next) => {
	// console.log('auth')
	// console.log(req.headers)
	// console.log(req.headers.authorization)
	const authHeader = req.headers.authorization
	if (!authHeader) {
		return next(new HttpException(401, '需提供authorization', 'authorization is missing'))
	}
	// 验证类型
	const authHeaderArr = authHeader.split(' ')
	if (authHeaderArr[0] !== 'Token') {
		return next(new HttpException(401, 'authorization 格式错误,格式为 Token xxxxx', 'Token missing'))
	}
	// 验证内容
	if (!authHeaderArr[1]) {
		return next(new HttpException(401, 'authorization 格式错误,格式为 Token xxxxx', 'Token content missing'))
	}
	//	解签验证
	try {
		console.log(authHeaderArr[1])
		const user = await decode(authHeaderArr[1])
		console.log('这是user',user)
		if (!user) {
			return next(new HttpException(401, 'token内容不存在', 'Token decode error'))
		}
		req.user = user
		req.token = authHeaderArr[1]
		return next()
	} catch (e) {
		// token失效。过期
		return next(new HttpException(401, '权限验证失败', e))
	}
}