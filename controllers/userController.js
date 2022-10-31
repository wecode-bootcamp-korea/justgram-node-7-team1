const userService = require('../services/userService')

const showAllUser = async (req, res) => {
  try {
      const result = await userService.showAllUser()
      res.status(200).json({ users: result })
  }
  catch (err) {
    console.log(err)
  }
  
}


const createUser = async (req, res) => {
  try {

    console.log('I am Controller 1')
    const { email, password } = req.body

    const password1 = `${password}`
    const name = "myName"
    const profile_image = "http://profileImage"
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

const showMe = (req, res) => {
  const id = req.decoded.id
  const email = req.decoded.email;
  res.status(200).json({
    id: id,
    email: email
  })
}

const tokenCheck = (req, res) => {
  const name = req.decoded.name;
  const profile = req.decoded.profile;
  const id = req.decoded.id
    res.status(200).json({
    code: 200,
    message: '토큰은 정상입니다.',
    data: {
      name: name,
      profile: profile,
      id: id
    }
  });
}

module.exports = {
  showAllUser,
  createUser,
  tokenCheck,
  showMe
}