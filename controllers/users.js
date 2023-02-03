import users from '../models/users.js'
import jwt from 'jsonwebtoken'
import products from '../models/products.js'

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
        cart: req.user.cart.length,
        role: req.user.role
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

// 取得使用者資料
export const getUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      result: {
        account: req.user.account,
        cart: req.user.cart,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        token: req.user.token
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '取得資料錯誤' })
  }
}

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

export const editCart = async (req, res) => {
  try {
    const idx = req.user.cart.findIndex(cart => cart.p_id.toString() === req.body.p_id)
    if (idx > 1) {
      const quantity = req.user.cart[idx].quantity + parseInt(req.body.quantity)
      if (quantity <= 0) {
        req.user.cart.splice(idx, 1)
      } else {
        req.user.cart[idx].quantity = quantity
      }
    } else {
      const product = await products.findById(req.body.p_id)
      console.log(product)
      if (!product || !product.sell) {
        res.status(404).json({ sucess: false, message: '找不到' })
        return
      }
      req.user.cart.push({
        p_id: req.body.p_id._id,
        quantity: parseInt(req.body.p_id.quantity)
      })
      await req.user.save()
      res.status(200).json({ sucess: true, message: '', result: req.user.cart.reduce((total, current) => total + current.quantity, 0) })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ sucess: false, message: '購物車未知錯誤' })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.p_id')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '取得購物車錯誤' })
  }
}
