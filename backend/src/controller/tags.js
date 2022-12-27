const HttpException = require('../exceptions/http.exception')
const Tags = require('../models/tag')

// 获取标签
module.exports.getTags = async (req, res, next) => {
	try {
		const tagsAll = await Tags.findAll()
		// 数据处理
		const tags = []
		if (tagsAll.length > 0) {
			for (const t of tagsAll) {
				tags.push(t.dataValues.name)
			}
		}
		res.status(200).json({
			status: 1,
			message: '获取标签成功',
			data: tags
		})
	} catch (e) {
		next(e)
	}
}
module.exports.createTags = async (req, res, next) => {
	try {
		const tag = req.body.tag
		const tagReasult = Tags.create({name: tag})
		res.status(200).json({
			status: 1,
			message: '创建标签成功',
			data: tagReasult.dataValues
		})
	} catch (e) {
		next(e)
	}
}