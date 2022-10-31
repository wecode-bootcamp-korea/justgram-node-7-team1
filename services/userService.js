const userDao = require('../models/userDao')

const showAllUser = async () => {
  return userDao.showAllUser()
}

const createUser = async (email, password, password1, name, profile_image) => {

  console.log('I am Service 1')
  if (!email.includes('@') || !email.includes('.')) { 
    throw new Error('EMAIL_INVALID')
  }

  if (password.length < 10) {
    throw new Error('PASSWORD_TOO_SHORT')
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

const showME = async() => {
  return userDao.showME()
} 

module.exports = {
  showAllUser,
  createUser,
  showME
}