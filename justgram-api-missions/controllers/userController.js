const jwt = require('jsonwebtoken')
const userService = require('../services/userService')
const userDao = require('../models/userDao')
// controller는 service에만 의존

const signUp = async (req, res) => {
	try {

		console.log('I am controller 1')

	  const { email, password, name, profileImage, phoneNumber, isAgreed } = req.body

    const REQUIRED_KEYS = { email , password, name }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        throw new Error(`KEY_ERROR: ${key}`)
      }
    })
		
		console.log('I am controller 2')
		const result = await userService.signUp(email, name, password, phoneNumber, profileImage)

		console.log('I am controller 3')
  	res.status(201).json({message: "USER_CREATED"})	
	} catch (err) {
    console.log(err)
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({message: "USER_ALREADY_EXISTS"})
    }
    res.status(400).json({message: err.message})
	}
}

const login = async (req, res) => {
  const { email, password } = req.body

  const [user] = await userDao.findUserByEmail(email)
  const token = jwt.sign({id: user.id}, process.env.SECRET_KEY)

  res.status(200).json({ message: "SUCCESS", token })
}

const getMe = async (req, res) => {
  try {
  const token = req.headers.token

  if (!token) {
    res.status(401).json({message: "TOKEN_REQUIRED"})
  }
  const me = jwt.verify(token, process.env.SECRET_KEY)
  console.log(me)

  const [user] = await userDao.getMe(me.id)

  res.status(200).json(user)

  } catch (err) {
    console.log(err)
  }
}
module.exports = {
	signUp,
  login,
  getMe
}