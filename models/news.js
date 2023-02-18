import { model, Schema } from 'mongoose'

const schema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: [true, '缺少日期']
  },
  title: {
    type: String,
    required: [true, '缺少標題']
  },
  content: {
    type: String,
    required: [true, '缺少內文']
  },
  image: {
    type: String,
    default: ''
  }
}, { versionKey: false })

export default model('news', schema)
