import { Schema, model, ObjectId } from 'mongoose'

const eventSchema = new Schema({
  u_id: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少報名者']
  }
})

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
  number: {
    type: Number,
    requird: [true, '缺少人數']
  },
  total: {
    type: [eventSchema],
    default: []
  }
}, { versionKey: false })

export default model('events', schema)
