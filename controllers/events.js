import events from '../models/events.js'

export const createEvent = async (req, res) => {
  try {
    const result = await events.create({
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      place: req.body.place,
      image: req.file?.path,
      number: req.body.number
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

export const getAllEvent = async (req, res) => {
  try {
    const result = await events.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getEvent = async (req, res) => {
  try {
    const result = await events.findById(req.params.id)
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editEvent = async (req, res) => {
  try {
    const result = await events.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      date: req.body.date,
      place: req.body.place,
      image: req.file?.path,
      number: req.body.number
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

export const delEvent = async (req, res) => {
  try {
    console.log(req.params.id)
    await events.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
