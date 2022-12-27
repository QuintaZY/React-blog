const userRoute = require('./../routes/users')
const followRoute = require('./../routes/follow')
const tagsRoute = require('./../routes/tags')
const ArticlesRoute = require('./../routes/articles')

const initRoute = (app) => {
	app.use('/api/v1/users', userRoute)
	app.use('/api/v1/follow', followRoute)
	app.use('/api/v1/tags', tagsRoute)
	app.use('/api/v1/articles', ArticlesRoute)
}

module.exports = initRoute