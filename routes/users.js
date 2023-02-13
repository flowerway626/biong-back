import { Router } from 'express'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import * as auth from '../middleware/auth.js'
import { register, login, logout, extend, getUser, getAllUser, editCart, editEvent, getCart, editUser } from '../controllers/users.js'
const router = Router()

// 註冊/登入/登出
router.post('/register', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)

// 取得
router.patch('/extend', auth.jwt, extend)
router.get('/get', auth.jwt, getUser)
router.get('/all', auth.jwt, admin, getAllUser)

// 購物車
router.get('/cart', auth.jwt, getCart)
router.post('/cart', content('application/json'), auth.jwt, editCart)

// 活動
router.patch('/event/:id', auth.jwt, editEvent)

// 資料編輯
router.patch('/:id', content('application/json'), auth.jwt, editUser)

export default router
