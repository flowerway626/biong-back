import photos from '../models/photos.js'

export const createPhoto = async (req, res) => {
  try {
    const result = await photos.create({
      name: req.body.name,
      date: req.body.date,
      tags: req.body.tags,
      image: req.files?.image?.[0]?.path || '',
      images: req.files?.images?.map(file => file.path) || []
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

export const getAllPhoto = async (req, res) => {
  try {
    // find() 空值不用查詢條件
    const result = await photos.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getPhoto = async (req, res) => {
  try {
    const result = await photos.findById(req.params.id)
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

export const editPhoto = async (req, res) => {
  try {
    console.log(req.body)
    // 資料更新
    const photo = await photos.findById(req.params.id)
    const newImages = photo.images.filter(image => !req.body?.delImages?.includes(image)).concat(req.files?.images?.map(file => file.path)).filter(image => image !== null && image !== undefined)

    const result = await photos.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      tags: req.body.tags,
      image: req.files?.image?.[0]?.path || photo.image,

      images: newImages
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
      console.log(error)
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const delPhoto = async (req, res) => {
  try {
    await photos.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
