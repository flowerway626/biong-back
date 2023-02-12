import { Schema, model } from 'mongoose'

// const eventSchema = new Schema({
//   // 報名者資訊
//   u_id: {
//     type: ObjectId,
//     ref: 'users',
//     required: [true, '缺少報名者']
//   },
//   // 報名者送出報名日期
//   date: {
//     type: Date
//   }
// })

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少活動標題']
  },
  description: {
    type: String,
    required: [true, '缺少活動說明']
  },
  date: {
    type: Date,
    required: [true, '缺少活動日期']
  },
  place: {
    type: String,
    required: [true, '缺少活動地點']
  },
  image: {
    type: String,
    required: [true, '缺少活動圖片']
  },
  // 報名人數設定
  number: {
    type: Number,
    requird: [true, '缺少人數']
  },
  // 報名人數資訊 (報名者_id、報名日期)
  member: {
    type: Array,
    default: []
  }
}, { versionKey: false })

export default model('events', schema)
