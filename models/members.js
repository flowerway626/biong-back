import { model, Schema } from 'mongoose'

const schema = new Schema({
  session: {
    type: String,
    required: [true, '缺少季數']
  },
  name: {
    type: String,
    required: [true, '缺少姓名']
  },
  features: {
    type: String,
    required: [true, '缺少簡介']
  },
  story: {
    type: String,
    required: [true, '缺少說明']
  },
  image: {
    type: String,
    default: ''
  },
  IGlink: {
    type: String,
    default: ''
  },
  num: {
    type: Number
  }
}, { versionKey: false })

export default model('members', schema)
