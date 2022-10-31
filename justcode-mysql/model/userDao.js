const { DataSource } = require("typeorm");
//const { validateToken } = require("./middleware/validateToken.js");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  // entities: ["dist/**/**.entity{.ts,.js}"],
});
myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});
//-----------------------sql 사용하는거------------------------
const getUserByEmail = async (email) => {
  const userDupl = await myDataSource.query(
    `select id, email from users where email = '${email}'`
  );
  return userDupl;
};

const createUser = async (email, nickname, secPw, profile_image) => {
  const result = await myDataSource.query(
    `INSERT INTO users (email, password, nickname, profile_image) VALUES('${email}', '${nickname}', '${secPw}', '${profile_image}' )`
  );
  return result;
};

const getUserData = async (email) => {
  const result = await myDataSource.query(
    `select id, password from users where email = '${email}'`
  );
  return result;
};

const getme = async (email) => {
  const [result] = await myDataSource.query(
    `select email, password from users where id = '${email}'`
  );
  return result;
};
module.exports = {
  getUserByEmail,
  createUser,
  getUserData,
  getme,
};
