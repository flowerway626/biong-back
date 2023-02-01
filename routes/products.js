import { Router } from 'express'
import content from '../middleware/content.js'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import { createProduct, getSellProducts, getAllProducts, getProduct, editProduct } from '../controllers/products.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, createProduct)
router.get('/', getSellProducts)
router.get('/all', getAllProducts)
router.get('/:id', getProduct)
router.post('/:id', content('multipart/form-data'), jwt, admin, upload, editProduct)

export default router
