const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userDao = require('../models/userDao')
// Service는 dao에만 의존

const signUp = async (email, name, password, phoneNumber, profileImage) => {
	// email validation
	// password validation
  console.log('I am service 1')
  const [_, foreNumber, laterNumber] = phoneNumber.split('-')
  if (password.includes(foreNumber) || password.includes(laterNumber)) {
    throw new Error('PASSWORD_INCLUDING_PHONE_NUMBER')
  }
  // 1
	const user = await userDao.findUserByEmail(email)
  console.log('I am service 2')
	// 2
    if (user.length !==0) {
      throw new Error("USER_ALREADY_EXISTS")
    }

    const hashedPw = bcrypt.hashSync(password, bcrypt.genSaltSync())

	const createdUser = await userDao.createUser(name, email, hashedPw, profileImage)
  console.log('I am service 3')

	return createdUser

}

module.exports = {
	signUp
}