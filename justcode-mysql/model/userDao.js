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

const getContentForPosting = async (user_ID, contents) => {
  const result = await myDataSource.query(
    `insert into postings(user_id, contents) values( '${user_ID}', '${contents}')`
  );
  return result;
};
const getAllPost = async (token) => {
  const result = await myDataSource.query(
    `select postings.user_id, users.profile_image, posting_images.posting_id, posting_images.image_url, postings.contents from users inner join postings on users.id = postings.user_id inner join posting_images on postings.id = posting_images.posting_id`
  );
  return result;
};
const update = async (id, contents, user_ID) => {
  const updatepost = await myDataSource.query(
    `UPDATE postings SET contents='${contents}' WHERE user_id=${user_ID} AND id=${id}; 
  `
  );
  return updatepost;
};
const afterUpdate = async (id) => {
  const afterUpdate = await myDataSource.query(
    `select * from postings WHERE id = ${id}`
  );
  return afterUpdate;
};
const postingsUser_Id = async (postingsId) => {
  const result = await myDataSource.query(
    `select user_id from postings where id = '${postingsId}'`
  );
  return result;
};
const deletePost = async (postingsId) => {
  const result = await myDataSource.query(
    `delete from postings where id = '${postingsId}'`
  );
  return result;
};
module.exports = {
  getUserByEmail,
  createUser,
  getUserData,
  getContentForPosting,
  getAllPost,
  update,
  afterUpdate,
  postingsUser_Id,
  deletePost,
};
