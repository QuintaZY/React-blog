const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../middleware/admin/auth.middleware')
// 控制器
const ArticlesController = require('../controller/articles')
// 文章
router.post('/', authMiddleware , ArticlesController.createArticle)
// 条件查看
router.get('/', ArticlesController.getArticles)
router.get('/follow', authMiddleware , ArticlesController.getFollowArticle)
router.get('/:slug', authMiddleware , ArticlesController.getArticle)
router.put('/:slug', authMiddleware , ArticlesController.updateArticles)
router.delete('/:slug', authMiddleware , ArticlesController.deleteArticles)

module.exports = router