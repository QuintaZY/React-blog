const validator = require('validator')
module.exports.validateCreateArticle = (title, description, body) => {
	let error = {}
	if (validator.isEmpty(title)) {
		error.username = '文章标题不能为空'
	}
	if (validator.isEmpty(description)) {
		error.password = '文章描述不能为空'
	}
	if (!validator.isEmpty(body)) {
		error.meail = '文章内容不能为空'
	}
	let validate = Object.keys(error).length < 1
	return {error, validate}
}
