import orders from '../models/orders.js'
import users from '../models/users.js'

// 使用者 - 建立訂單 (結帳)
export const createOrder = async (req, res) => {
  try {
    // 檢查購物車是不是空的
    if (req.user.cart.length === 0) {
      res.status(400).json({ success: false, message: '購物車是空的' })
      return
    }
    // 檢查是否有下架商品 .populate(關聯資料路徑)
    let result = await users.findById(req.user._id, 'cart').populate('cart.p_id')
    // .every() 對陣列跑迴圈
    // 檢查購物車內的商品是否都有上架，迴圈成功跑完 canCheckout === true
    const canCheckout = result.cart.every(cart => {
      // cart.p_id.sell 購物車內的產品是否上架中
      return cart.p_id.sell
    })
    // canCheckout === false
    if (!canCheckout) {
      res.status(400).json({ success: false, message: '包含下架商品' })
      return
    }
    // 建立訂單
    result = await orders.create({ u_id: req.user._id, products: req.user.cart })
    // 清空購物車
    req.user.cart = []
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 使用者 - 查看訂單
export const getUserOrders = async (req, res) => {
  try {
    // 查詢 u_id = req.user._id，查到後透過商品的 id(products.p_id) 帶出商品資料
    const result = await orders.find({ u_id: req.user._id }).populate('products.p_id')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 管理者 - 查看所有訂單
export const getAllOrders = async (req, res) => {
  try {
    // .populate(關聯資料路徑, 取特定的欄位)
    // 撈出所有訂單，帶出訂單內商品的資料 及 該筆訂單的帳戶名稱
    const result = await orders.find().populate('products.p_id').populate('u_id', 'name')
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
