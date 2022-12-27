const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../middleware/admin/auth.middleware')
// 控制器
const FollowController = require('../controller/follow')

// 关注
router.post('/:username',authMiddleware, FollowController.follow)
// 取消关注
router.delete('/:username',authMiddleware,FollowController.cancelFollow)
// 检查用户和作者之间的关注关系
router.get('/:username',authMiddleware,FollowController.getFollows)


// router.get('/', authMiddleware, FollowController.getUser)
// router.post('/login', FollowController.login)




module.exports = router