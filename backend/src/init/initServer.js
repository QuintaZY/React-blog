const initServer = async (app) => {
	return new Promise((resolve, reject) => {
		const PORT = process.env.PORT || 8080
		app
			.listen(PORT, () => {
				console.log(`服务器执行成功,server is running on http://localhost:${PORT}`)
				resolve()
			})
			.on('error', () => {
				console.log(`服务器执行失败`)
				reject()
			})
	})
}

module.exports = initServer