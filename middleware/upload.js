import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

const upload = multer({
  // storage 儲存空間
  storage: new CloudinaryStorage({ cloudinary }),
  // cb => callback
  // 檔案限制
  fileFilter (req, file, cb) {
    // 如果檔案不是 image 開頭 (只允許圖片檔)
    if (!file.mimetype.startsWith('image')) {
      // 建立錯誤訊息
      cb(new multer.MulterError('LIMIT_FORMAT'), false)
    } else {
      cb(null, true)
    }
  },
  // 限制
  limits: {
    // 檔案大小 (1MB)
    fileSize: 1024 * 1024
  }
})

export default (req, res, next) => {
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }])(req, res, error => {
    if (error instanceof multer.MulterError) {
      let message = '上傳錯誤'
      if (error.code === 'LIME_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FILE_FORMAT') {
        message = '檔案格式錯誤'
      }
      res.status(400).json({ success: false, message })
    } else if (error) {
      res.status(500).json({ success: false, message: '未知錯誤' })
    } else {
      next()
    }
  })
}
