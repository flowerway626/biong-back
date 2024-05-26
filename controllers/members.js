import members from '../models/members.js'

export const createMembers = async (req, res) => {
  try {
    const result = await members.create({
      session: req.body.session,
      name: req.body.name,
      features: req.body.features,
      story: req.body.story,
      image: req.files?.image?.[0]?.path || '',
      IGlink: req.body.IGlink,
      num: req.body.num
    })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤 |' + error })
    }
  }
}

export const getAllMembers = async (req, res) => {
  try {
    const result = await members.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editMembers = async (req, res) => {
  try {
    let result = await members.findByIdAndUpdate(req.params.id, {
      session: req.body.session,
      name: req.body.name,
      features: req.body.features,
      story: req.body.story,
      image: req.files?.image?.[0]?.path,
      IGlink: req.body.IGlink,
      num: req.body.num
    })
    if (!result) {
      res.status(400).json({ success: false, message: '找不到此筆資料' })
    } else {
      result = await members.findById(req.params.id)
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤 | ' + error })
    }
  }
}

export const deleteMembers = async (req, res) => {
  try {
    await members.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
