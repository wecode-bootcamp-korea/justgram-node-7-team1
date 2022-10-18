const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});
myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});
const app = express();
app.use(express.json());

// 유저 들고오기
app.get("/users", async (req, res) => {
  const getusers = await myDataSource.query("select * from users;");

  console.log("result: ", getusers);

  res.status(200).json({ users: getusers });
});

//미션 3

//유저 추가
app.post("/join", async (req, res) => {
  const { email, nickname, password, profile_image } = req.body;

  const result = await myDataSource.query(
    `INSERT INTO users (email, nickname, password, profile_image) VALUES('${email}', '${nickname}', '${password}', '${profile_image}' )`
  );

  res.status(200).json({ message: "user_created" });
});

//미션4

//포스팅 추가
app.post("/posting", async (req, res) => {
  const { user_id, contents } = req.body;

  const result = await myDataSource.query(
    `insert into postings(user_id, contents) values( '${user_id}', '${contents}')`
  );
  res.status(200).json({ message: "post Created" });
});

//게시글 들고오기

app.get("/post", async (req, res) => {
  const getpost = await myDataSource.query(
    `select postings.user_id, users.profile_image, posting_images.posting_id, posting_images.image_url, postings.contents from users inner join postings on users.id = postings.user_id inner join posting_images on postings.id = posting_images.posting_id`
  );

  console.log("data : ", getpost);

  res.status(200).json({ users: getpost });
});

//게시글 수정하기

app.patch("/update", async (req, res) => {
  const { user_id, id, content } = req.body;

  const updatepost = await myDataSource.query(
    `UPDATE postings SET contents='${content}' WHERE user_id=${user_id} AND id=${id}; 
    `
  );
  const afterUpdate = await myDataSource.query(`select * from postings`);
  res.status(200).json({ data: afterUpdate });
});

// 게시글 삭제

app.delete("/deletePost", async (req, res) => {
  const { postingsId } = req.body;

  const result = await myDataSource.query(
    `delete from postings where id = ${postingsId}`
  );
  res.status(200).json({ message: "post Deleted" });
});

const server = http.createServer(app);

try {
  server.listen(8000, () => {
    console.log("server is listening on PORT 8000");
  });
} catch (err) {
  console.log(err);
}
