const userDao = require('../models/userDao')


const createUser = async (email, password, password1, name, profile_image) => {

  console.log('I am Service 1')
  if (!email.includes('@') || !email.includes('.')) { //OR
    throw new Error('EMAIL_INVALID')
  }

  if (password.length < 10) {
    throw new Error('PASSWORD_INVALID')
  }

  if (password !== password1) {
    throw new Error('PASSWORD_DONT_SAME')
  }

  const user = await userDao.getUserByEmail(email)
  console.log('I am Service 2')
  if (user.length !== 0) {
    throw new Error("USER_ALREADY_EXISTS")
  }

  const createdUser = await userDao.createUserInDb(email, name, password, profile_image)
  console.log('I am Service 3')

  return createdUser
}

module.exports = {
  createUser
}