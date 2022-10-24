const { DataSource } = require('typeorm');
const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
});
const bcrypt = require('bcryptjs');


myDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  });



const getUserByEmail = async (email) => {
  console.log('I am model 1')
  const user = await myDataSource.query(`
    SELECT id, email FROM users WHERE email= '${email}'
  `)
  return user
}

const createUserInDb = async (email, name, password, profile_image) => {
  console.log('I am model 2')

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      myDataSource.query(`
    INSERT INTO users (email, name, password, profile_image)
    VALUES (
      '${email}', '${name}', '${hash}', '${profile_image}'
    )
  `)
    })
  })
}


module.exports = {
  getUserByEmail,
  createUserInDb
}
