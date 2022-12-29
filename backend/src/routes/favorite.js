const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../middleware/admin/auth.middleware')
// 控制器
const FavoriteController = require('../controller/favorites')

// 喜欢
router.post('/:slug',authMiddleware, FavoriteController.addFavorite)
// 取消喜欢
router.delete('/:slug',authMiddleware,FavoriteController.cancelFavorite)





module.exports = router