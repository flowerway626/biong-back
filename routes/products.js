import { Router } from 'express'
import content from '../middleware/content.js'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { createProduct, getSellProducts, getAllProducts, getSixProducts, getProduct, editProduct, delProduct } from '../controllers/products.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, createProduct)
router.get('/', getSellProducts)
router.get('/all', jwt, admin, getAllProducts)
router.get('/index', getSixProducts)

router.get('/:id', getProduct)
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editProduct)
// 刪除商品
router.delete('/:id', jwt, admin, delProduct)

export default router
