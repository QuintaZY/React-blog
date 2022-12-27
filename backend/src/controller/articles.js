// 创建文章
const {validateCreateArticle} = require('../utils/validate/article.validate');
const HttpException = require('../exceptions/http.exception');
const {getSlug} = require('../utils/slug');
const User = require('../models/user');
const Article = require('../models/article');
const Tag = require('../models/tag');

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
					article.addTag(newTag)
				} else {
					// 文章和标签关系，taglist
					article.addTag(tag)
				}
			}
		}
		// 返回数据
		article = await Article.findByPk(slug, {include: Tag})
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

	} catch (e) {
		next(e)
	}
}
// 获取文章  关注作者的文章
module.exports.getFollowArticle = async (req, res, next) => {
	try {

	} catch (e) {
		next(e)
	}
}
// 获取全局文章文章
module.exports.getArticles = async (req, res, next) => {
	try {

	} catch (e) {
		next(e)
	}
}
// 更新文章
module.exports.updateArticles = async (req, res, next) => {
	try {

	} catch (e) {
		next(e)
	}
}
// 删除文章
module.exports.deleteArticles = async (req, res, next) => {
	try {

	} catch (e) {
		next(e)
	}
}
