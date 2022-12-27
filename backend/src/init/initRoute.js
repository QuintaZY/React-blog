const userRoute = require('./../routes/users')
const followRoute = require('./../routes/follow')

const initRoute = (app) => {
	app.use('/api/v1/users', userRoute)
	app.use('/api/v1/follow', followRoute)
}

module.exports = initRoute