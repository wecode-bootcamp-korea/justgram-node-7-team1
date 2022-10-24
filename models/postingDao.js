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

const showList = async () => {
  const listData = await myDataSource.query(`
    SELECT users.id, users.profile_image, posting_images.posting_id, posting_images.image_url, posts.contents 
    FROM users 
    INNER JOIN posts ON posts.user_id = users.id 
    INNER JOIN posting_images ON posting_images.posting_id = posts.id;
  `);

  return listData
}

const createPost = async (userId, title, contents) => {
  const posting = await myDataSource.query(`
  INSERT INTO posts (user_id, title, contents) 
  VALUES ('${userId}', '${title}', '${contents}')
`)
  return posting
}

const updatePost = async (id, contents) => {
  const updatePosting = await myDataSource.query(`
  UPDATE posts SET
    contents = '${contents}' 
    WHERE id= '${id}';
    `);
  return updatePosting
}

const deletePost = async (id) => {
  const deletePosting = await myDataSource.query(`
  DELETE FROM posts WHERE id = '${id}';
  `);
  return deletePosting
}

module.exports = {
  showList,
  createPost,
  updatePost,
  deletePost
}