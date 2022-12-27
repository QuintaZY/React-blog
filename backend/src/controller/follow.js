const HttpException = require('../exceptions/http.exception')
const User = require('../models/user')

// 添加关注
module.exports.follow = async (req, res, next) => {
	try {
		//	获取参数：被关注的用户名
		const username = req.params.username
		//	校验：提供被关注者的用户名
		//		参数校验
		const userA = await User.findOne({
			where: {
				username
			}
		})
		//		业务验证：被关注者是否存在
		if (userA) {
			throw new HttpException(404, '被关注的用户不存在', 'user with username not found')
		}
		//	关注着信息
		const {email} = req.user
		//		获取Email，通过token
		const userB = await User.findByPk(email)
		//		获取用户信息
		//	添加关注
		await userA.addFollowers(userB)
		//		建立关系：被关注者主键和关注者主键存在数据库表follows中
		//	返回被关注者的基本信息，关注状态
		const profile = {
			username: userA.username,
			bio: userA.bio,
			avatar: userA.avatar,
			following: true
		}
		res.status(200)
			.json({
				status: 1,
				message: '关注成功',
				data: profile
			})
	} catch (e) {
		next(e)
	}
}
// 取消关注
module.exports.cancelFollow = async (req, res, next) => {
	try {
//	获取参数：被关注的用户名
		const username = req.params.username
		//	校验：提供被关注者的用户名

		//		参数校验
		const userA = await User.findOne({
			where: {
				username
			}
		})
		//		业务验证：被关注者是否存在
		if (userA) {
			throw new HttpException(404, '被关注的用户不存在', 'user with username not found')
		}
		//	关注着信息
		const {email} = req.user
		//		获取Email，通过token
		const userB = await User.findByPk(email)
		//		获取用户信息
		//	添加关注
		await userA.removeFollowers(userB)
		//		建立关系：被关注者主键和关注者主键存在数据库表follows中
		//	返回被关注者的基本信息，关注状态
		const profile = {
			username: userA.username,
			bio: userA.bio,
			avatar: userA.avatar,
			following: false
		}
		res.status(200)
			.json({
				status: 1,
				message: '取消关注',
				data: profile
			})
	} catch (e) {
		next(e)
	}
}
// 获取粉丝 && 判断登录的是否关注
module.exports.getFollows = async (req, res, next) => {
	try {
		const username = req.params.username
		//	校验：提供被关注者的用户名
		//		参数校验
		const userAuther = await User.findOne({
			where: {
				username
			},
			include: ['followers']
		})
		//		业务验证：被关注者是否存在
		if (!userAuther) {
			throw new HttpException(404, '被关注的用户不存在', 'user with username not found')
		}
		const {email} = req.user
		let following = false
		let followers = []
		for (const user of userAuther.followers) {
			if (email === user.dataValues.email) {
				following = true
			}
			delete user.dataValues.password
			delete user.dataValues.Followers
			followers.push(user.dataValues)
		}
		const profile = {
			username: userAuther.username,
			bio: userAuther.bio,
			avatar: userAuther.avatar,
			following,	// 是否关注
			followers	// 所有粉丝
		}
		res.status(200)
			.json({
				status: 1,
				message: '获取关注列表成功',
				data: profile
			})
	} catch (e) {
		next(e)
	}
}