const dotenv = require("dotenv")

dotenv.config()
const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
 .then(() => {
    console.log("Data Source has been initialized!")
 })

const findUserByEmail = async (email) => {
    const user = await myDataSource.query(`
        SELECT id, email FROM users WHERE email = '${email}';
    `)
    return user
}

const createUser = async (nickname, email, hashed_password, profile_image) =>{
    const Data = await myDataSource.query(`
        INSERT INTO users (email, nickname, password, profile_image)
        VALUES ('${email}', '${nickname}', '${hashed_password}', '${profile_image}')
    `);
    return createUser
}

const existUser = async (email) => {
    const [existingUser] = await myDataSource.query(`
        SELECT id, email, password FROM users WHERE email = '${email}'
    `)
    return existingUser
}

module.exports ={
    findUserByEmail,
    createUser,
    existUser
}