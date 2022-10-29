const  dataSource = require('./database');

async function findUserByEmail(email){
  const [userInfo] = await dataSource.query(`
    SELECT
      id,
      password
    FROM users
    WHERE
    email = ?
  `, [email]);
  return userInfo;
}

async function findUserById(id){
  const [userInfo] = await dataSource.query(`
    SELECT
      id,
      password,
      email,
      nickname
    FROM users
    WHERE
    id = ?
  `, [id]);
  return userInfo;
}

async function getAllUser() {
  const allUsers = await dataSource.query(`
    SELECT
      id,
      email,
      nickname
    FROM users
  `);
  return allUsers;
}

async function addUser({email, password, nickname, profile_image}) {
  return await dataSource.query(
    `INSERT INTO users(
                        email,
                        nickname,
                        password,
                        profile_image
                      ) VALUES (?, ?, ?, ?);
                      `,
    [email, nickname, password, profile_image]
  )
}

module.exports = {
  findUserByEmail,
  findUserById,
  getAllUser,
  addUser,
}