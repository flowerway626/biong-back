import { Router } from 'express'
import content from '../middleware/content.js'
import * as auth from '../middleware/auth.js'
import { register, login, logout, extend, getUser, editCart, getCart, editUser } from '../controllers/users.js'
const router = Router()

router.post('/register', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)

router.patch('/extend', auth.jwt, extend)
router.get('/get', auth.jwt, getUser)
router.get('/cart', auth.jwt, getCart)
router.post('/cart', content('application/json'), auth.jwt, editCart)

router.post('/:id', content('application/json'), auth.jwt, editUser)

export default router
