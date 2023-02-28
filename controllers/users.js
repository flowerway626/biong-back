import users from '../models/users.js'
import jwt from 'jsonwebtoken'
import products from '../models/products.js'
import events from '../models/events.js'

// 註冊
export const register = async (req, res) => {
  try {
    await users.create({
      account: req.body.account,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
      passwordConfirm: req.body.passwordConfirm
    })
    res.status(200).json({ success: true, message: '註冊成功' })
  } catch (error) {
    if (error.name === 'ValidatorError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors[0])] })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 登入
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '登入成功',
      result: {
        token,
        account: req.user.account,
        name: req.user.name,
        email: req.user.email,
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
        role: req.user.role,
        event: req.user.event,
        phone: req.user.phone
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 登出
export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    return res.status(200).json({ success: true, message: '登出成功' })
  } catch (error) {
    return res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 登入後做驗證用
// 前端 localStorage 只會存使用者的 jwt，所以每次進網頁都要跟後端要使用者的其他資料
export const getUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      result: {
        _id: req.user._id,
        account: req.user.account,
        password: req.user.password,
        cart: req.user.cart.reduce((total, current) => total + current.quantity, 0),
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        token: req.user.token,
        event: req.user.event,
        phone: req.user.phone
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '取得資料錯誤' })
  }
}

// 使用者 編輯資料
export const editUser = async (req, res) => {
  try {
    const result = await users.findByIdAndUpdate(req.params.id, {
      account: req.body.account,
      password: req.body.password,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 管理者 編輯使用者資料
export const adminEditUser = async (req, res) => {
  try {
    const result = await users.findByIdAndUpdate(req.body._id, {
      account: req.body.account,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    }, { new: true })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 驗證
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, mesage: '未知錯誤' })
  }
}

// 使用者 新增 / 編輯購物車
export const editCart = async (req, res) => {
  try {
    // 找購物車有沒有此商品 (撈出此商品的索引值)
    const idx = req.user.cart.findIndex(cart => cart.p_id.toString() === req.body.p_id)
    if (idx > -1) {
      // 如果有，檢查新數量是多少 (新數量 = 新增/減少後的數量 + 原購物車數量)
      const quantity = req.user.cart[idx].quantity + parseInt(req.body.quantity)
      if (quantity <= 0) {
        // 如果新數量小於 0，從購物車陣列移除此商品
        req.user.cart.splice(idx, 1)
      } else {
        // 如果新數量大於 0，修改目前購物車陣列的數量
        req.user.cart[idx].quantity = quantity
      }
    } else {
      // 如果購物車內沒有此商品，檢查商品是否存在
      const product = await products.findById(req.body.p_id)
      // 如果不存在，回應 404
      if (!product || !product.sell) {
        res.status(404).send({ success: false, message: '找不到' })
        return
      }
      // 如果存在(代表此商品有上架只是購物車內沒有)，加入購物車陣列 (新增商品的_id 和 數量)
      req.user.cart.push({
        p_id: req.body.p_id,
        quantity: parseInt(req.body.quantity)
      })
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.cart.reduce((total, current) => total + current.quantity, 0) })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 取得 使用者 購物車
export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.p_id')
    res.status(200).json({ success: true, message: '', result: result.cart })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '取得購物車錯誤' })
  }
}

// 使用者 新增活動
export const editEvent = async (req, res) => {
  try {
    const idx = req.user.event.findIndex((event) => event.e_id.toString() === req.params.id)
    if (idx > -1) {
      res.status(400).json({ success: false, message: '已報名' })
      return
    } else {
      const event = await events.findById(req.params.id)
      if (!event) {
        res.status(404).json({ success: true, message: '找不到此活動' })
        return
      }
      // 更新參加者的電話
      await users.findByIdAndUpdate(req.user._id, { phone: req.body.phone }, { new: true })
      // 把參加活動放進 user 的event 陣列內
      req.user.event.push({ e_id: req.params.id })
      await req.user.save()
    }
    const result = await users.findById(req.user.id).populate('event.e_id')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 使用者 取得報名過的活動
export const getEvent = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'event').populate('event.e_id', 'dateStart dateEnd name image')
    res.status(200).json({ success: true, message: '', result: result.event })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '取得使用者活動錯誤' })
  }
}

// 取得所有使用者
export const getAllUser = async (req, res) => {
  try {
    const result = await users.find({ role: 0 })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '取得資料錯誤' })
  }
}
