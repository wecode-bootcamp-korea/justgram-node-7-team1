const userService = require('../services/userService')

const createUser = async (req, res) => {
  try {

    console.log('I am Controller 1')
    const { email, password, password1, name, profile_image } = req.body

    const REQUIRE_KEYS = [email, password, password1, name]

    REQUIRE_KEYS.map((key) => {
      if (!key) {
        throw new Error(`KEY_ERROR: ${key}`)
      }
    })

    console.log('I am Controller 2')
    const result = await userService.createUser(email, password, password1, name, profile_image)

    console.log('I am Controller 3')
    res.status(201).json({ message: "userCreated" })
  } catch (err) {
    console.log(err)
    res.status(400).json({ message: err.message })
  }
}


module.exports = {
  createUser
}