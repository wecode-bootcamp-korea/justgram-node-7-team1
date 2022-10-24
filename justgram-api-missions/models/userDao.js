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
	console.log('I am dao 1')
    const user = await myDataSource.query(`
      SELECT id, email FROM users WHERE email = '${email}'
    `)
	return user
}

const createUser = async (name, email, hashedPw, profileImage) => {

	console.log('I am dao 2')
    await myDataSource.query(`
      INSERT INTO users (name, email, password, profile_image)
      VALUES (
        '${name}', '${email}', '${hashedPw}', '${profileImage}'
      )
    `)   
}

module.exports = {
	findUserByEmail,
	createUser
}