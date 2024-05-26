import { Router } from 'express'
import admin from '../middleware/admin.js'
import { jwt } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import content from '../middleware/content.js'
import { createMembers, getAllMembers, editMembers, deleteMembers } from '../controllers/members.js'

const router = Router()

router.post('/', content('multipart/form-data'), jwt, admin, upload, createMembers)

router.get('/', getAllMembers)

router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editMembers)

router.delete('/:id', jwt, admin, deleteMembers)

export default router
