import { model, Schema } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少商品名稱']
  },
  price: {
    type: Number,
    min: [0, '價格錯誤'],
    required: [true, '缺少數量']
  },
  description: {
    type: String,
    required: [true, '缺少商品說明']
  },
  image: {
    type: String,
    required: [true, '缺少商品照片']
  },
  category: {
    type: String,
    required: [true, '缺少分類'],
    enum: {
      values: ['服飾', '飾品', '食品', '其他'],
      message: '分類錯誤'
    }
  },
  sell: {
    type: Boolean,
    required: [true, '缺少狀態']
  }
}, { versionKey: false })

export default model('products', schema)
