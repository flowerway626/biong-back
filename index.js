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
import aboutRoute from './routes/abouts.js'
import memberRoute from './routes/members.js'
import './passport/passport.js'

mongoose.connect(process.env.DB_URL)
mongoose.set('sanitizeFilter', true)

const app = express()

// 跨域請求
// origin 代表請求來源，postman 等後端的請求會是 undefind
// callback(錯誤, 是否允許)
app.use(
  cors({
    origin (origin, callback) {
      // 允許跨域來源為 postman、github、localhost
      if (origin === undefined || origin.includes('github') || origin.includes('localhost')) {
        callback(null, true)
      } else {
        callback(new Error(), false)
      }
    }
  })
)

// 處理跨域錯誤
app.use((_, req, res, next) => {
  res.status(403).json({ success: false, message: '請求被拒' })
})

// 將請求解析為 json 格式
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
app.use('/abouts', aboutRoute)
app.use('/members', memberRoute)

// 定時喚醒 render 不用再等待撈資料載入
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
