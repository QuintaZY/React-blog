const userRoute = require('./../routes/users')

const initRoute = (app) => {
	app.use('/api/v1/users', userRoute)
}

module.exports = initRoute