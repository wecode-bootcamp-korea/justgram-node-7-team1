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
  // entities: ["dist/**/**.entity{.ts,.js}"],
});

const app = express();
app.use(express.json());
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

const controller = require("./controller/usercontroller");
//-----------------------------------------------------------------------------------------
// 유저 들고오기(과제에 없는데 왜 적혀있는지 모름)
app.get("/users", async (req, res) => {
  try {
    const getusers = await myDataSource.query("select * from users;");

    console.log("result: ", getusers);

    res.status(200).json({ users: getusers });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
});
//미션 3

//-----------------------------------------------------------------------------------------
//유저 추가
app.post("/join", controller.signup);

//-----------------------------------------------------------------------------------------
//미션 5 유저 로그인
app.post("/login", controller.login);

//-----------------------------------------------------------------------------------------
//미션4
//포스팅 추가
app.post("/posting", controller.posting);
//-----------------------------------------------------------------------------------------
//(전체)게시글 들고오기
app.get("/post", controller.getPost);
//-----------------------------------------------------------------------------------------
//게시글 수정하기
app.patch("/update", controller.update);
//-----------------------------------------------------------------------------------------
// 게시글 삭제
app.delete("/deletePost", controller.deletePost);
//-----------------------------------------------------------------------------------------
const server = http.createServer(app);

try {
  server.listen(8000, () => {
    console.log("server is listening on PORT 8000");
  });
} catch (err) {
  console.log(err);
  res.json({ message: err.message });
}
