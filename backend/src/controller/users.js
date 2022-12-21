const {validateCreateUser, validateUserLogin} = require('../utils/validate/user.validate');
const HttpException = require('../exceptions/http.exception')
const User = require('../models/user')
const {md5Password, matchPassword} = require('../utils/md5')
const {sign} = require('../utils/jwt')
// 创建用户
module.exports.creacteUser = async (req, res, next) => {
	try {
		// 注册
		// 获取提交内容
		let {username, password, email} = req.body.user
		// 数据验证
		let {error, validate} = validateCreateUser(username, password, email)
		if (validate) {
			throw new HttpException(401, '用户提交数据失败', error)
		}
		// 业务验证
		const existUser = await User.findByPk(email)
		if (existUser) {
			throw new HttpException(401, '用户注册邮箱已存在', 'error is exist')
		}
		// Email是否存在
		const md5PWD = await md5Password(password)
		const user = await User.create({
			username, password: md5PWD, email
		})
		if (user) {
			console.log(user)
			let data = {}
			data.username = username
			data.email = email
			data.token = await sign(username, email)
			data.bio = null
			data.avatar = null
			// 返回数据
			res.status(200)
				.json({
					status: 1, data, message: '用户创建成功'
				})
		}
	} catch (e) {
		console.log(e)
		next(e)
	}
}
// 获取用户
module.exports.getUser = async (req, res) => {
	res.status(200)
		.json({
			code: 1, message: '请求成功', data: {
				name: 'hello'
			}
		})
}
// 用户登录
module.exports.login = async (req, res, next) => {
	try {
		let {email, password} = req.body.user
		let {error, validate} = validateUserLogin(email, password)
		// 邮箱是否存在
		const user = await User.findByPk(email)
		if (!user) {
			throw new HttpException(401, '用户不存在', 'user not found')
		}
		// 密码是否匹配
		const oldMd5PWD = user.dataValues.password
		const match = await matchPassword(oldMd5PWD, password)
		if (!match) {
			throw new HttpException(401, '用户密码错误', 'password not match')
		}
		// 返回数据 生成token
		delete user.dataValues.password;
		user.dataValues.token = await sign(user.dataValues.username, user.dataValues.email)
		//	返回数据
		return res.status(200).json({
			status: 1, data: user.dataValues, message: '用户登录成功'
		})
	} catch (e) {
		next(e)
	}
}
// 获取用户信息
module.exports.getUser = async (req, res, next) => {
	try {
		// 获取请求数据
		const {email} = req.user
		// 验证用户是否存在
		// 接口数据验证  不需要(用户已经登录)
		// Email验证用户是否存在
		const user = await User.findByPk(email)
		if (!user) {
			throw new HttpException(401, '用户不存在', 'user not found')
		}
		// 返回数据
		delete user.dataValues.password
		// 追加token
		user.dataValues.token = req.token
		// 返回用户数据
		return res.status(200).json({
			status: 1,
			data: user.dataValues,
			message: '用户信息请求成功'
		})
	} catch (e) {
		next(e)
	}
}
// 修改用户信息
module.exports.updateUser = async (req, res, next) => {
	try {
		// 验证接口权限
		// 获取请求数据
		const {email} = req.user
		// 验证请求数据 ， Email是否存在
		const user = await User.findByPk(email)
		if (!user) {
			throw new HttpException(401, '用户不存在', 'user not found')
		}
		// 获取用户数据
		// 获取请求数据   body数据  更新的信息
		const bodyUser = req.body.user
		if (bodyUser) {
			// 修改用户数据
			const username = bodyUser.username ? bodyUser.username : user.username
			const bio = bodyUser.bio ? bodyUser.bio : user.bio
			const avatar = bodyUser.avatar ? bodyUser.avatar : user.avatar
			// password 更新 : 加密
			let password = user.password
			if(bodyUser.password) {
				password = await md5Password(bodyUser.password)
			}
			// 更新操作
			const updateUser = await user.update({username,bio,avatar,password})
			// 返回数据
			// 去除密码
			delete updateUser.dataValues.password
			// 添加token  生成新的token，
			updateUser.dataValues.token = await sign(username,email)
			//  修改操作
			return res.status(200).json({
				status: 1,
				message: '用户信息修改成功',
				data: user.dataValues
			})
		} else {
			throw new HttpException(401, '更新数据不能为空', 'update body is null')
		}

	} catch (e) {
		next(e)
	}
}