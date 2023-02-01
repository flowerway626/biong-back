import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import userRoute from './routes/users.js'
import productRoute from './routes/products.js'
import './passport/passport.js'

mongoose.connect(process.env.DB_URL)
mongoose.set('sanitizeFilter', true)

const app = express()

// 跨域請求
app.use(
  cors({
    origin (origin, callback) {
      if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
        callback(null, true)
      } else {
        callback(new Error(), false)
      }
    }
  })
)

app.use((_, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒' })
})

app.use(express.json())

app.use((_, req, res, next) => {
  res.status(400).json({ success: false, message: '格式錯誤' })
})

app.use('/users', userRoute)
app.use('/products', productRoute)

app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: '' })
})

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: '未知錯誤' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
