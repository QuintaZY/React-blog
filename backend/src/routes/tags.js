const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../middleware/admin/auth.middleware')
// 控制器
const TagsController = require('../controller/tags')

// 关注
router.get('/', TagsController.getTags)
router.post('/', authMiddleware, TagsController.createTags)


// router.get('/', authMiddleware, FollowController.getUser)
// router.post('/login', FollowController.login)


module.exports = router