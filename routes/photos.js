import { Router } from 'express'
import { jwt } from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import content from '../middleware/content.js'
import { createPhoto, getAllPhoto, getPhoto, editPhoto } from '../controllers/photos.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, createPhoto)
router.get('/', getAllPhoto)
router.get('/:id', getPhoto)
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editPhoto)

export default router
