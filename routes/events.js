import { Router } from 'express'
import content from '../middleware/content.js'
import { jwt } from '../middleware/auth.js'
import upload from '../middleware/upload.js'
import admin from '../middleware/admin.js'
import { createEvent, getAllEvent, getEvent, getChartEvent, editEvent, delEvent, editMember } from '../controllers/events.js'

const router = Router()

// 建立
router.post('/', content('multipart/form-data'), jwt, admin, upload, createEvent)
// 查詢所有
router.get('/', getAllEvent)

router.get('/chart', jwt, admin, getChartEvent)

// 查詢單個
router.get('/:id', getEvent)
// 新增報名者
router.patch('/user/:id', jwt, editMember)
// 修改
router.patch('/:id', content('multipart/form-data'), jwt, admin, upload, editEvent)
// 刪除
router.delete('/:id', jwt, admin, delEvent)

export default router
