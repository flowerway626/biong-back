import { model, Schema, ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

const cartSchema = new Schema({
  p_id: {
    type: ObjectId,
    ref: 'products',
    required: [true, '缺少商品']
  },
  quantity: {
    type: Number,
    required: [true, '缺少數量']
  }
})

const eventSchema = new Schema({
  e_id: {
    type: ObjectId,
    ref: 'events',
    required: [true, '缺少活動']
  },
  phone: {
    type: String,
    required: [true, '缺少電話']
  }
})

const schema = new Schema({
  account: {
    type: String,
    required: [true, '缺少帳號'],
    minlength: [4, '帳號過短'],
    maxlength: [20, '帳號過長'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  password: {
    type: String,
    required: [true, '缺少密碼']
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: [true, '缺少 email'],
    unique: true,
    validate: {
      validator (email) {
        return validator.isEmail(email)
      },
      message: 'email 格式錯誤'
    }
  },
  tokens: {
    type: [String],
    default: []
  },
  role: {
    type: Number,
    default: 0
  },
  cart: {
    type: [cartSchema],
    default: []
  },
  event: {
    type: [eventSchema],
    defaule: []
  }
}, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidationError({ message: '密碼錯誤' }))
      next(error)
      return
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.password) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidationError({ message: '密碼錯誤' }))
      next(error)
      return
    }
  }
  next()
})

export default model('users', schema)
