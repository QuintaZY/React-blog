const bcrypt = require('bcrypt')
const SALT = 10
const hashPassword = (password) => {
	return new Promise((resolve, reject) => {
		bcrypt.hash(password, SALT, (error, encrypted) => {
			if (error) {
				reject(error)
			} else {
				resolve(encrypted)
			}
		})
	})
}
const matchPassword = (oldHashPWD,password) => {
	return new Promise(async (resolve, reject) => {
	    const match = await bcrypt.hash(password,oldHashPWD)
	})
}
module.exports = hashPassword
module.exports = matchPassword
