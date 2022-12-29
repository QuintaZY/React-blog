const HttpException = require('../exceptions/http.exception')
const User = require('../models/user')
const Article = require('../models/article');
const Tag = require('../models/tag');

function handleArticle(article, author, count) {
	const newTags = []
	for (const t of article.dataValues.tags) {
		newTags.push(t.name)
	}
	article.dataValues.tags = newTags

	delete author.dataValues.password
	delete author.dataValues.email
	article.dataValues.author = author
	article.dataValues.favoriteCount = count
	article.dataValues.favorited = true

	return article.dataValues
}

// 添加关注
module.exports.addFavorite = async (req, res, next) => {
	try {
		const {slug} = req.params
		let article = await Article.findByPk(slug, {include: Tag})
		if (!article) {
			throw new HttpException(404, '喜欢的文章不存在', 'not found')
		}
		await article.addUsers(req.user.email)
		// 获取文章作者
		const author = await article.getUser()
		// 获取喜欢的个数
		const count = await article.countUsers()
		// 数据处理
		article = handleArticle(article, author, count)
		res.status(200).json({
			status: 1,
			message: '添加喜欢成功',
			data: article
		})
	} catch (e) {
		next(e)
	}
}
// 取消关注
module.exports.cancelFavorite = async (req, res, next) => {
	try {
		try {
			const {slug} = req.params
			let article = await Article.findByPk(slug, {include: Tag})
			if (!article) {
				throw new HttpException(404, '喜欢的文章不存在', 'not found')
			}
			// 移除喜欢
			await article.removeUsers(req.user.email)
			// 获取文章作者
			const author = await article.getUser()
			// 获取喜欢的个数
			const count = await article.countUsers()
			// 数据处理
			article = handleArticle(article, author, count)
			res.status(200).json({
				status: 1,
				message: '取消喜欢成功',
				data: article
			})
		} catch (e) {
			next(e)
		}
	}