import users from '../models/users.js'
import jwt from 'jsonwebtoken'

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

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    return res.status(200).json({ success: true, message: '登出成功' })
  } catch (error) {
    return res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

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
