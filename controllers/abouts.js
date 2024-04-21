import abouts from '../models/abouts.js'

export const createAbouts = async (req, res) => {
  try {
    const result = await abouts.create({
      session: req.body.session,
      intro: req.body.intro,
      info: JSON.parse(req.body.info),
      image: req.files?.image?.[0]?.path || ''
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

export const getAbouts = async (req, res) => {
  try {
    const result = await abouts.findById(req.params.id)
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getAllAbouts = async (req, res) => {
  try {
    const result = await abouts.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const editAbouts = async (req, res) => {
  try {
    console.log('req.body :>> ', req.body)
    let result = await abouts.findByIdAndUpdate(req.params.id, {
      session: req.body.session,
      intro: req.body.intro,
      info: JSON.parse(req.body.info),
      image: req.files?.image?.[0]?.path
    })
    if (!result) {
      res.status(400).json({ success: false, message: '找不到此筆資料' })
    } else {
      result = await abouts.findById(req.params.id)
      console.log('result :>> ', result)
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

export const deleteAbouts = async (req, res) => {
  try {
    await abouts.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
