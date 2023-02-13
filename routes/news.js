import { Router } from 'express'
import admin from '../middleware/admin.js'
import { jwt } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import content from '../middleware/content.js'
import { creatwNew, getNew, getAllNew, editNew, deleteNew } from '../controllers/news.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, creatwNew)
router.get('/all', getAllNew)
router.get('/:id', getNew)
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editNew)
router.delete('/:id', jwt, admin, deleteNew)

export default router
