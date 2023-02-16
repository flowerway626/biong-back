import news from '../models/news.js'

export const creatwNew = async (req, res) => {
  try {
    const result = await news.create({
      date: req.body.date,
      title: req.body.title,
      content: req.body.content,
      image: req.file?.path || '',
      tags: req.body.tags
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
    const result = await news.find({ _id: req.params.id })
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

export const editNew = async (req, res) => {
  try {
    const result = await news.findByIdAndUpdate(req.params.id, {
      date: req.body.date,
      title: req.body.title,
      content: req.body.content,
      image: req.file?.path,
      tags: req.body.tags
    })
    if (!result) {
      res.status(400).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, meswsage: '', result })
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
    await news.findByIdAndDelete(res.params.id)
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
