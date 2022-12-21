const validator = require('validator')
module.exports.validateCreateUser = (username,password,meail) => {
	let error = {}
	if (validator.isEmpty(username)) {
		error.username = '用户名不能为空'
	}
	if (validator.isEmpty(password)) {
		error.password = '密码不能为空'
	}
	if (!validator.isEmpty(meail) && !validator.isEmail(meail)) {
		error.meail = '邮箱格式不对'
	}
	let validateResult = Object.keys(error).length < 1
	return {error,validateResult}
}
module.exports.validateUserLogin = (meail,password) => {
	let error = {}
	if (validator.isEmpty(meail)) {
		error.password = '邮箱不能为空.'
	}
	if (validator.isEmpty(password)) {
		error.password = '密码不能为空.'
	}
	if (!validator.isEmpty(meail) && !validator.isEmail(meail)) {
		error.meail = '邮箱格式不对'
	}
	let validate = Object.keys(error).length < 1
	return {error,validate}
}