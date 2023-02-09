import { Router } from 'express'
import admin from '../middleware/admin.js'
import { jwt } from '../middleware/auth.js'
import { createOrder, getAllOrders, getUserOrders } from '../controllers/orders.js'

const router = Router()

router.post('/', jwt, createOrder)
router.get('/', jwt, getUserOrders)
router.get('/all', jwt, admin, getAllOrders)

export default router
