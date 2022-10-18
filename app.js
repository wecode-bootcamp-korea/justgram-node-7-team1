const http = require('http')
const express = require('express')
const cors = require('cors')

const morgan = require('morgan');

const dotenv = require("dotenv");
dotenv.config()
const { DataSource } = require('typeorm');

const mysql = require("mysql2");
const { profile } = require('console');

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

app.get('/ping', (req, res) => {
  res.json({ message: '/ pong' })
})

app.get('/users', async (req, res) => {
  const userData = await myDataSource.query(`SELECT * FROM users;`);
  console.log(userData)
  res.status(200).json({ users: userData })
});



const createUser = async (req, res) => {

  const { email, password, name, profile_image } = req.body // 프론트에서 받아온 정보를 가져옵니다.

  const result = await myDataSource.query(`
    INSERT INTO users (name, email, password, profile_image)
    VALUES (
      '${name}', '${email}','${password}', '${profile_image}'
    )
  `)

  res.status(201).json({ message: "userCreated" })
  // express 덕분에 JSON.stringify 함수를 사용할 필요없이
  // response 객체의 json 메소드를 활용합니다.

}

app.post('/signup', createUser) // 첫번째 인자에는 endpoint url 을 기입하고,
// app.post('/login', (req, res) => {res.json('login success')}) // 각각의 요청에 대해 핸들링 하는 함수를 두번째 인자로 넣습니다.

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특셩",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
];

const createPost = async (req, res) => {

  const { user_id, contents } = req.body // 프론트에서 받아온 정보를 가져옵니다.
  const { posting_id, image_url } = req.body

  const result = await myDataSource.query(`
    INSERT INTO posts (user_id, contents)
    VALUES (
      '${user_id}', '${contents}'
    )
  `)
  const result1 = await myDataSource.query(`
  INSERT INTO posting_images (posting_id, image_url)
  VALUES (
    '${posting_id}', '${image_url}'
  )
`)

  res.status(201).json({ message: "postCreated" })
}

app.post('/posts', createPost)

const data1 = (req, res) => {
  res.json({
    "data": [
      {
        "userID": 1,
        "userName": "Rebekah Johnson",
        "postingId": 1,
        "postingTitle": "간단한 HTTP API 개발 시작!",
        "postingContent": "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현."
      },
      {
        "userID": 2,
        "userName": "Fabian Predovic",
        "postingId": 2,
        "postingTitle": "HTTP의 특성",
        "postingContent": "Request/Response와 Stateless!!"
      },
      {
        "userID": 3,
        "userName": "new user 1",
        "postingId": 3,
        "postingTitle": "내용 1",
        "postingContent": "sampleContent3"
      },
      {
        "userID": 4,
        "userName": "new user 2",
        "postingId": 4,
        "postingTitle": "내용 2",
        "postingContent": "sampleContent4"
      }
    ]
  })
}

app.get('/listView', data1);

app.patch('/listView', (res, req) => {
  const id = 1

  for (let i = 0; i < posts.length; i++) {
    const posting = posts[i]
    if (posting.id === 1) {
      posting.content = 'node'
    }
  }
  res.status(200).json({ data: posts })
})

const server = http.createServer(app);

try {
  server.listen(8000, () => {
    console.log('server is listening on PORT 8000');
  })
} catch (err) {
  console.log(err);
}
