const userRoute = require('./../routes/users')

const initRoute = (app) => {
	app.use('/api/v1/user1', userRoute)
}

module.exports = initRoute