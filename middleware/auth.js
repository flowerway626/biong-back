import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'

export const login = (req, res, next) => {
  // 使用 passport.js 中的 passport.authenticate() 驗證使用者登入
  passport.authenticate('login', { session: false }, (error, user, info) => {
    if (error || !user) {
      if (info) {
        if (info.message === 'Missing credentials') info.message = '欄位錯誤'
        return res.status(401).json({ success: false, message: info.message || error.message })
      } else {
        return res.status(500).json({ success: false, message: '未知錯誤' })
      }
    }
    req.user = user
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (error, data, info) => {
    if (error || !data) {
      // 如果是 JWT 解譯錯誤 => 過期、SECERT 對不上
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(401).json({ sucess: false, message: 'JWT 錯誤' })
      } else {
        return res.status(401).json({ sucess: false, message: info.message || '未知錯誤' })
      }
    }
    req.user = data.user
    req.token = data.token
    next()
  })(req, res, next)
}
