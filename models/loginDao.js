const { DataSource } = require('typeorm');
const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
});

myDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!")
  });

const findDbUser = async (email) => {
  const [dbUser] = await myDataSource.query(`
  SELECT id, email, name, password, profile_image
    FROM users WHERE email = '${email}'
    `)
    return dbUser
}

module.exports = {
  findDbUser
}