import products from '../models/products.js'
import { Types } from 'mongoose'

// 新增產品
export const createProduct = async (req, res) => {
  try {
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      // 沒有上傳圖片時，req.file === undefined
      image: req.files?.image?.[0]?.path || '',
      sell: req.body.sell,
      category: req.body.category
    })
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

// 查詢商品是否上架中 (給使用者看的)
export const getSellProducts = async (req, res) => {
  try {
    // 查詢 sell 為 true => 有上架的商品
    const result = await products.find({ sell: true })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 查詢所有商品 (僅管理者看得到)
export const getAllProducts = async (req, res) => {
  try {
    // find() 空值不用查詢條件
    const result = await products.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getSixProducts = async (req, res) => {
  try {
    const result = await products.find().sort({ _id: -1 }).limit(6)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 查詢單個商品
export const getProduct = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
    // 如果 id 格式正確但無資料
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    // id 錯誤
    if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 編輯商品
export const editProduct = async (req, res) => {
  try {
    // 產品資料更新
    const result = await products.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.files?.image?.[0]?.path,
      sell: req.body.sell,
      category: req.body.category
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
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

export const delProduct = async (req, res) => {
  try {
    await products.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getRecomProducts = async (req, res) => {
  try {
    const result = await products.aggregate([
      {
        // $match 過濾 $ne 不等於 => 過濾掉 _id 不等於該的 id
        $match: { sell: true, _id: { $ne: Types.ObjectId(req.params.id) } }
      },
      {
        // 隨機選擇數量
        $sample: { size: 4 }
      }
    ])
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
