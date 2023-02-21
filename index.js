import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import https from 'https'
import userRoute from './routes/users.js'
import productRoute from './routes/products.js'
import orderRoute from './routes/orders.js'
import eventRoute from './routes/events.js'
import newRoute from './routes/news.js'
import photoRoute from './routes/photos.js'
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
app.use('/orders', orderRoute)
app.use('/events', eventRoute)
app.use('/news', newRoute)
app.use('/photos', photoRoute)

if (process.env.render) {
  setInterval(() => {
    https.get(process.env.render)
  }, 1000 * 60 * 5)
}

app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: '未知錯誤' })
})

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
