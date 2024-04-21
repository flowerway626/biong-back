import { Router } from 'express'
import admin from '../middleware/admin.js'
import { jwt } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import content from '../middleware/content.js'
import { createAbouts, getAbouts, getAllAbouts, editAbouts, deleteAbouts } from '../controllers/abouts.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, createAbouts)

router.get('/', getAllAbouts)
router.get('/:id', getAbouts)

router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editAbouts)

router.delete('/:id', jwt, admin, deleteAbouts)

export default router
