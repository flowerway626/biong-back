import events from '../models/events.js'

// 建立活動
export const createEvent = async (req, res) => {
  try {
    const result = await events.create({
      name: req.body.name,
      description: req.body.description,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      place: req.body.place,
      image: req.files?.image?.[0]?.path || '',
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

// 查詢所有活動
export const getAllEvent = async (req, res) => {
  try {
    const result = await events.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 查詢單一活動
export const getEvent = async (req, res) => {
  try {
    const result = await events.findById(req.params.id).populate('member.u_id')
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

export const getChartEvent = async (req, res) => {
  try {
    const all = await events.find()
    const result = []
    all.forEach((val, idx, arr) => {
      result.push({ name: arr[idx].name, count: arr[idx].member.length })
    })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 編輯活動
export const editEvent = async (req, res) => {
  try {
    const event = await events.findById(req.params.id)
    const result = await events.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd,
      place: req.body.place,
      image: req.files?.image?.[0]?.path || event.image,
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
      console.log(error)
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 刪除活動
export const delEvent = async (req, res) => {
  try {
    await events.findByIdAndDelete(req.params.id)
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 新增報名者資訊
export const editMember = async (req, res) => {
  try {
    const member = await events.findById(req.params.id, 'member').populate('member.u_id')
    const idx = member.member.findIndex((user) => user.u_id === req.user._id)
    if (idx === -1) {
      await events.updateOne({ _id: req.params.id }, {
        $push: {
          member: {
            u_id: req.user._id,
            date: new Date()
          }
        }
      }, { new: true })
      const result = await events.findById(req.params.id)
      res.status(200).json({ success: true, message: '', result })
    } else {
      res.status(400).json({ success: false, message: '已報名' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
