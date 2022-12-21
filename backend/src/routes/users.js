const express = require('express')
const router = express.Router()
const {authMiddleware} = require('../middleware/admin/auth.middleware')
const UserController = require('../controller/users')

router.get('/', authMiddleware, UserController.getUser)
router.post('/', UserController.creacteUser)
router.post('/login', UserController.login)
router.patch('/up', authMiddleware, UserController.updateUser) // 局部更新



module.exports = router