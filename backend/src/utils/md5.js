const md5 = require('md5')
const SALT = 'salt'
const md5Password = (password) => {
	return new Promise((resolve, reject) => {
		const md5PWD = md5(password + SALT)
		resolve(md5PWD)
	})
}
const matchPassword = (oldMd5PWD,password) => {
	return new Promise((resolve, reject) => {
		const newMd5PWD = md5(password + SALT)
		if(newMd5PWD === oldMd5PWD){
			resolve('true')
		}else {
			resolve(false)
		}
	})
}

module.exports = {md5Password, matchPassword}