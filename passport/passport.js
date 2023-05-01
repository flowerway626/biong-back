import passport from 'passport'
import bcrypt from 'bcrypt'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import users from '../models/users.js'

// 使用 Local 策略寫 login 方式
passport.use('login', new passportLocal.Strategy({
  // 更改預設帳密欄位名稱
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, done) => {
  try {
    const user = await users.findOne({ account })
    if (!user) {
      return done(null, false, { message: '此帳號不存在' })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: '密碼錯誤' })
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}))

// 使用 Local 策略寫 jwt 方式
passport.use('jwt', new passportJWT.Strategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // 用 JWT_SECRET 解譯，JWT_SECRET => 驗證 JWT 是否有效
  secretOrKey: process.env.JWT_SECRET,
  passReqToCallback: true,
  // 忽略過期檢查
  ignoreExpiration: true
}, async (req, payload, done) => {
  const token = req.headers.authorization.split(' ')[1]
  try {
    const user = await users.findOne({ _id: payload._id, tokens: token })
    if (user) {
      return done(null, { user, token })
    } else {
      return done(null, false, { message: '使用者不存在或 JWT 無效' })
    }
  } catch (error) {
    return done(error, false)
  }
}))
