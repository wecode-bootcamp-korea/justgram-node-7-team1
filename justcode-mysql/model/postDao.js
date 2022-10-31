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
//----------------------------------------------------------------

//posting
const getContentForPosting = async (user_ID, contents) => {
  const result = await myDataSource.query(
    `insert into postings(user_id, contents) values( '${user_ID}', '${contents}')`
  );
  return result;
};
//get_post
const getAllPost = async (token) => {
  const result = await myDataSource.query(
    `select postings.user_id, users.profile_image, posting_images.posting_id, posting_images.image_url, postings.contents from users inner join postings on users.id = postings.user_id inner join posting_images on postings.id = posting_images.posting_id`
  );
  return result;
};
//post_update
const update = async (id, contents, user_ID) => {
  const updatepost = await myDataSource.query(
    `UPDATE postings SET contents='${contents}' WHERE user_id=${user_ID} AND id=${id}; 
  `
  );
  return updatepost;
};
//post_update
const afterUpdate = async (id) => {
  const afterUpdate = await myDataSource.query(
    `select * from postings WHERE id = ${id}`
  );
  return afterUpdate;
};
//post_delete
const postingsUser_Id = async (postingsId) => {
  const result = await myDataSource.query(
    `select user_id from postings where id = '${postingsId}'`
  );
  return result;
};
//post_delete
const deletePost = async (postingsId) => {
  const result = await myDataSource.query(
    `delete from postings where id = '${postingsId}'`
  );
  return result;
};

module.exports = {
  getContentForPosting,
  getAllPost,
  update,
  afterUpdate,
  postingsUser_Id,
  deletePost,
};
