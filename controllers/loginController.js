const loginService = require('../services/loginService')

const loginUser = async (req, res) => {
  try {
      const { email, password } = req.body

  const REQUIRED_KEYS = { email, password }

  Object.keys(REQUIRED_KEYS).map((key) => {
    if (!REQUIRED_KEYS[key]) {
      const error = new Error(`KEY_ERROR: ${key}`)
      error.statusCode = 400
      throw error
    }
  })
  const result = await loginService.loginUser(email, password)

  res.status(200).json({
    code: 200,
    message: '토큰이 발급되었습니다.',
    token: token
  });
}  catch (err) {
  console.log(err)
  res.status(err.statusCode).json({ message: err.message })
}
  }

module.exports = {
  loginUser
}

