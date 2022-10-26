const userService = require('../services/userService')


const signUp = async (req,res) => {
    try{
        const { nickname, email, password, profile_image } = req.body;
            
        const REQUIRED_KEYS = { nickname, email, password }
            
        Object.keys(REQUIRED_KEYS).map((key) =>{
            if(!REQUIRED_KEYS[key]) {
                throw new Error(`KEY_ERROR: ${key}`)
            }
        })
        
        const result = await userService.signUp(nickname, email, password, profile_image)

        res.json({ message: "userCreated" });
    } catch(err){
        console.log(err)
        res.json({message:err.message})
    }
}

const login = async (req,res) => {
    try{
        const {email, password} = req.body

        const REQUIRED_KEYS = [ email, password ]
        Object.keys(REQUIRED_KEYS).map((key) => {
            if (!REQUIRED_KEYS[key]) {
                throw new Error(`KEY ERROR : ${key}`)
            }
        })
        console.log("controller 1")

        const result = await userService.login(email,password)
        console.log("controller 2")
        res.json({message:'loginSuccess', token:result})
    } catch(err){
        res.json({message:err.message})
    }
}

module.exports = {
    signUp,
    login
}