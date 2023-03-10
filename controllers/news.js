import news from '../models/news.js'
import { Types } from 'mongoose'

export const creatwNew = async (req, res) => {
  try {
    const result = await news.create({
      title: req.body.title,
      content: req.body.content,
      image: req.files?.path || ''
    })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const getNew = async (req, res) => {
  try {
    const result = await news.findById(req.params.id)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getAllNew = async (req, res) => {
  try {
    const result = await news.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 首頁顯示最新六筆
export const getSixNew = async (req, res) => {
  try {
    const result = await news.find().sort({ _id: -1 }).limit(6)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editNew = async (req, res) => {
  try {
    const result = await news.findByIdAndUpdate(req.params.id, {
      date: req.body.date,
      title: req.body.title,
      content: req.body.content,
      image: req.files?.image?.[0]?.path
    })
    if (!result) {
      res.status(400).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const deleteNew = async (req, res) => {
  try {
    await news.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 取推薦商品
export const getRecomNew = async (req, res) => {
  try {
    const result = await news.aggregate([
      {
        // $match 過濾 $ne 不等於 => 過濾掉 _id 不等於該產品的 id
        $match: { _id: { $ne: Types.ObjectId(req.params.id) } }
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
