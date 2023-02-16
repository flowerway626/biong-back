import { model, Schema } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少標題']
  },
  date: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: Array,
    default: []
  },
  image: {
    type: String,
    required: [true, '缺少封面圖']
  },
  images: {
    type: Array,
    default: []
  }
}, { versionKey: false })

export default model('photos', schema)
