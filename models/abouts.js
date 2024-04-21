import { model, Schema } from 'mongoose'

const infoSchma = new Schema({
  name: {
    type: String,
    required: [true, '缺少節目名稱']
  },
  alias: {
    type: Object,
    required: [true, '缺少節目別名']
  },
  dateStart: {
    type: String,
    required: [true, '缺少播出起日']
  },
  dateEnd: {
    type: String,
    required: [true, '缺少播出迄日']
  },
  Starring: {
    type: Array,
    required: [true, '缺少主要參演']
  },
  director: {
    type: Array,
    required: [true, '缺少製作導演']
  },
  episode: {
    type: String,
    required: [true, '缺少集數']
  },
  TWott: {
    type: Array,
    default: [],
    required: [true, '缺少串流平台']
  },
  description: {
    type: String,
    required: [true, '缺少節目介紹']
  }
})

const schema = new Schema({
  date: {
    type: Date,
    default: Date.now,
    required: [true, '缺少日期']
  },
  session: {
    type: String,
    required: [true, '缺少季數']
  },
  intro: {
    type: String,
    required: [true, '缺少節目背景']
  },
  info: {
    type: infoSchma,
    required: [true, '缺少播出資訊']
  },
  image: {
    type: String,
    default: ''
  }
}, { versionKey: false })

export default model('abouts', schema)
