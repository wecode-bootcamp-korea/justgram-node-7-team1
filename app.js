const http = require('http')
const express = require('express')
const cors = require('cors')
const morgan = require('morgan');
const dotenv = require("dotenv");
dotenv.config()
const { DataSource } = require('typeorm');
const methodOverride = require('method-override');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {validateToken} = require('./middlewares/validateToken')
const userController = require('./controllers/userController')
const loginController = require('./controllers/loginController')
const postingController = require('./controllers/postingController');
const { updatePost } = require('./models/postingDao');



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

const app = express()
app.use(express.json())
app.use(cors());
app.use(morgan('combined'));
app.use(methodOverride());

// 핑퐁 던지기
app.get('/ping', (req, res) => {
  res.json({ message: '/ pong' })
})

// 전체 유저 보여주기
app.get('/users', userController.showAllUser)

// 유저 생성
app.post('/signup', userController.createUser)

// 로그인하기
app.post('/login', loginController.loginUser)

// 토큰 확인
app.get('/payload', validateToken, userController.tokenCheck)

// 게시물 보여주기
app.get('/list', validateToken, postingController.getList);

// 게시물 생성
app.post('/posts', validateToken, postingController.createPost);

// 게시글 업데이트
app.post('/update', validateToken, postingController.updatePost);

// 게시글 삭제
app.post('/delete', validateToken, postingController.deletePost);

const server = http.createServer(app);

try {
  server.listen(8000, () => {
    console.log('server is listening on PORT 8000');
  })
} catch (err) {
  console.log(err);
}
