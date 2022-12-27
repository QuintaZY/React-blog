const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../middleware/admin/auth.middleware')
// 控制器
const ArticlesController = require('../controller/articles')
// 文章
router.post('/', authMiddleware , ArticlesController.createArticle)
router.get('/:slug', authMiddleware , ArticlesController.getArticle)
router.get('/', authMiddleware , ArticlesController.getArticles)
router.get('/follow', authMiddleware , ArticlesController.getFollowArticle)
router.put('/', authMiddleware , ArticlesController.updateArticles)
router.delete('/', authMiddleware , ArticlesController.deleteArticles)

module.exports = router