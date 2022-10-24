const userService = require('../services/userService')
// controller는 service에만 의존

const signUp = async (req, res) => {
	try {

		console.log('I am controller 1')

	  const { email, password, name, profileImage, phoneNumber, isAgreed } = req.body

    const REQUIRED_KEYS = { email , password, name, phoneNumber, isAgreed }

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

module.exports = {
	signUp
}