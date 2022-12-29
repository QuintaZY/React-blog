// 创建文章
const {validateCreateArticle} = require('../utils/validate/article.validate');
const HttpException = require('../exceptions/http.exception');
const {getSlug} = require('../utils/slug');
const User = require('../models/user');
const Article = require('../models/article');
const Tag = require('../models/tag');
const sequelize = require('../db/sequelize');

function handleArticle(article, author) {
	const newTags = []
	for (const t of article.dataValues.tags) {
		newTags.push(t.name)
	}
	article.dataValues.tags = newTags
	delete author.dataValues.password
	delete author.dataValues.email
	article.dataValues.author = author

	return article.dataValues
}

function handleArticles(article) {
	const newTags = []
	for (const t of article.dataValues.tags) {
		newTags.push(t.name)
	}
	article.dataValues.tags = newTags
	// 处理作者信息
	let author = {
		username: article.dataValues.user.username,
		email: article.dataValues.user.email,
		bio: article.dataValues.user.bio,
		avatar: article.dataValues.user.avatar
	}
	delete article.dataValues.user
	article.dataValues.author = author
	return article.dataValues
}

// 创建文章控制器
module.exports.createArticle = async (req, res, next) => {
	try {
		// 获取请求内容，
		const {title, description, body, tags} = req.body.artilce
		// 请求内容验证,
		let {error, validate} = validateCreateArticle(title, description, body)
		if (!validate) {
			throw new HttpException(401, '文章创建参数验证失败', error)
		}
		// 获取作者信息\
		const {email} = req.user
		const author = await User.findByPk(email)
		if (!author) {
			throw new HttpException(401, '作者不存在', 'author user not found')
		}
		// 创建文章
		let slug = getSlug()
		let article = await Article.create({
			slug,
			title,
			description,
			body,
			UserEmail: author
		})
		// 存储文章和标签的关系
		if (tags) {
			for (const t of tags) {
				let tag = await tags.findByPk(t) // 已存在的标签
				let newTag // 新标签
				if (!tag) {
					// 创建标签
					newTag = await Tag.create({
						name: t
					})
					// 文章创建tag 一对多
					await article.addTag(newTag)
				} else {
					// 文章和标签关系，taglist
					await article.addTag(tag)
				}
			}
		}
		// 返回数据
		article = await Article.findByPk(slug, {include: Tag})
		// 标签信息返回优化
		// 作者信息优化
		article = handleArticle(article, author)
		res.status(200).json({
			status: 1,
			message: '文章创建请求成功',
			data: article
		})
	} catch (e) {
		next(e)
	}
}
// 获取文章  单个文章
module.exports.getArticle = async (req, res, next) => {
	try {
		const {slug} = req.params
		let article = await Article.findByPk(slug, {include: Tag})
		const author = await article.getUser()
		article = handleArticle(article, author)
		res.status(200).json({
			status: 1,
			message: '文章获取成功',
			data: article
		})
	} catch (e) {
		next(e)
	}
}
// 获取文章  关注作者的文章
module.exports.getFollowArticle = async (req, res, next) => {
	try {
		const fansEmail = req.user.email
		const query = `SELECT UserEmail FROM followers WHERE followerEMAIL="${fansEmail}"`
		const followAuthors = await sequelize.query(query)
		if (followAuthors[0].length == 0) {
			return res.status(200).json({
				status: 1,
				message: '获取文章为空，没有关注的作者',
				data: []
			})
		}

		let followAuthorEmails = []
		for (const e of followAuthors[0]) {
			followAuthorEmails.push(e.userEmail)
		}
		// 获取作者文章
		let articleAll = await Article.findAll({
			where: {
				userEmail: followAuthorEmails
			},
			include: [Tag, User]
		})
		// 每个作者的每个文章进行处理，标签和作者信息
		let articles = []
		for (let e of articleAll) {
			articles.push(handleArticles(e))
		}
		res.status(200).json({
			status: 1,
			message: '获取文章成功'

		})
	} catch (e) {
		next(e)
	}
}
// 获取全局文章，条件查询
// 限制，偏移量
// 标签 -- 文章
// 作者 -- 文章
// 作者 -- 标签 -- 文章
module.exports.getArticles = async (req, res, next) => {
	try {
		// 获取条件参数 query tag author limit offset
		const {tag, author, limit = 20, offset = 0} = req / query()
		// 获取文章数组:
		//     有标签没有作者
		let articleAll = []
		if (tag && !author) {
			articleAll = await Article.findAll({
				include: [{
					model: Tag,
					attributes: ['name'],
					where: {
						name: tag
					}
				}, {
					model: User,
					attributes: ['email', 'username', 'bio', 'avatar']
				}],
				limit: parseInt(limit),
				offset: parseInt(offset)
			})
		} else if (!tag && author) {
			//     有作者没有标签
			articleAll = await Article.findAll({
				include: [{
					model: Tag,
					attributes: ['name']
				}, {
					model: User,
					attributes: ['email', 'username', 'bio', 'avatar'],
					where: {username: author}
				}],
				limit: parseInt(limit),
				offset: parseInt(offset)
			})
		} else if (tag && author) {
			//     有作者和标签
			//     有作者没有标签
			articleAll = await Article.findAll({
				include: [{
					model: Tag,
					attributes: ['name'],
					where: {name: tag}
				}, {
					model: User,
					attributes: ['email', 'username', 'bio', 'avatar'],
					where: {username: author}
				}],
				limit: parseInt(limit),
				offset: parseInt(offset)
			})
		} else {
			//     没有作者没有标签
			articleAll = await Article.findAll({
				include: [{
					model: Tag,
					attributes: ['name']
				}, {
					model: User,
					attributes: ['email', 'username', 'bio', 'avatar']
				}],
				limit: parseInt(limit),
				offset: parseInt(offset)
			})
		}

		// 文章数据梳理
		let articles = []
		for (let i of articleAll) {
			articles.push(handleArticles(a))
		}
		res.status(200).json({
			status:1,
			message:'获取成功',
			data: articles
		})
	} catch (e) {
		next(e)
	}
}
// 更新文章
module.exports.updateArticles = async (req, res, next) => {
	try {
		const {slug} = req.params
		const data = req.body.article
		let article = await Article.findByPk(slug, {include: Tag})

		const loginUser = await User.findByPk(req.user.email)
		if (!loginUser) {
			throw new HttpException(401, '登录用户不存在', 'user not found')
		}
		const authorEmail = article.userEmail
		if (loginUser.email !== authorEmail) {
			throw new HttpException(403, '只有作者账号才能修改', 'only author have permission to update')
		}
		// 修改字段
		const title = data.title ? data.title : article.title
		const description = data.description ? data.description : article.description
		const body = data.body ? data.body : article.body
		// 更新操作
		const updateResult = await article.update({title, description, body})
		// 返回数据
		const newArticle = handleArticle(updateResult, loginUser)
		// 响应数据
		res.status(200).json({
			status: 1,
			message: '文章更新成功',
			data: newArticle
		})
	} catch (e) {
		next(e)
	}
}
// 删除文章
module.exports.deleteArticles = async (req, res, next) => {
	try {
		const {slug} = req.params
		let article = await Article.findByPk(slug, {include: Tag})
		if (!article) {
			throw new HttpException(404, '删除文章不存在', 'not found')
		}
		const {email} = req.user
		const user = await User.findByPk(req.user.email)
		// 判断登录用户
		const authorEmail = article.userEmail
		if (email !== authorEmail) {
			throw new HttpException(403, '只有作者才能删除', 'not found')
		}
		await Article.destroy({where: {slug}})
		res.status(200).json({
			status: 1,
			message: '文章删除成功'
		})
	} catch (e) {
		next(e)
	}
}
