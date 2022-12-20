const express = require('express')
const router = express.Router()

router.get('/',(req,res) => {
	console.log(123)
	res.json({
		status: 200,
		message: 'success',
		data : {
			code: 1,
			message: '请求成功',
			data: {
				name: 'hello'
			}
		}
	})
})

module.exports = router