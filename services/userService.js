const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const userDAO = require('../models/userDAO')

const signUp = async (nickname, email, password, profile_image) => {
    const user = await userDAO.findUserByEmail(email)

    if(user.length !== 0){
        throw new Error("EMAIL_ALREADY_EXISTS")
    }
    // EMAIL, PASSWORD 정규화
    if(!email.includes('@') || !email.includes('.')){
        throw new Error('EMAIL_INVALID')
    }

    if(password.length < 10){
        throw new Error("PASSWORD_INVALID")
    }

    //password 암호화
    const hashed_password = await bcrypt.hashSync(password,await bcrypt.genSaltSync())

    const createdUser = userDAO.createUser(nickname, email, hashed_password,profile_image)

    return createdUser

}

const login = async (email, password) => {
    if(!email.includes('@') || !email.includes('.')){
        throw new Error('EMAIL_INVALID')
    }

    if(password.length < 10){
        throw new Error("PASSWORD_INVALID")
    }

    const user = await userDAO.existUser(email)

    if(!user){
        const error = new Error("userDoesNotExist")
        error.statusCode = 404
        throw error
    }

    const isSame = bcrypt.compareSync(password, user.password)
    if(isSame === false){
        const error = new Error("INVALID_PASSWORD")
        error.statusCode = 404
        throw error
    }

    const token = jwt.sign({id : user.id}, process.env.SECRET_KEY)
    return token
}

module.exports = {
    signUp,
    login
}