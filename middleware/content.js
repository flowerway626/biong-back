export default (type) => {
  return (req, res, next) => {
    if (!req.headers['content-type'] || !req.headers['content-type'].includes(type)) {
      res.status(400).json({ success: false, message: '輸入格式錯誤' })
      return
    }
    next()
  }
}
