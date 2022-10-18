const http = require('http')
const express = require('express')
const dotenv = require("dotenv")
dotenv.config()
const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
 .then(() => {
    console.log("Data Source has been initialized!")
 })

const users = [
  {
    id: 1,
    name: "Rebekah Johnson",
    email: "Glover12345@gmail.com",
    password: "123qwe",
  },
  {
    id: 2,
    name: "Fabian Predovic",
    email: "Connell29@gmail.com",
    password: "password",
  },
];

const posts = [
  {
    id: 1,
    title: "간단한 HTTP API 개발 시작!",
    content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
    userId: 1,
  },
  {
    id: 2,
    title: "HTTP의 특성",
    content: "Request/Response와 Stateless!!",
    userId: 1,
  },
];

const app = express()

app.use(express.json())
app.get('/ping', (req, res) => {
  res.json({message: 'pong'})
})
//회원가입 

// 1. app에 회원가입하는 URL등록 

app.get('/users', async (req, res) => {
  // database - order to get users
  // "SELECT * FROM users;"
  const userData = await myDataSource.query(`SELECT * FROM users;`)

  console.log('result: ', userData)
  // send data to client as a response
  res.status(200).json({ users: userData })

})

app.post('/join', async(req, res) => {

	// 2. Name, email, password received from 요청(request)

	const { email, password, name, profileImage } = req.body

	// 3. users 배열에 고객 추가 -> table에 data 추가
  const result = await myDataSource.query(`
    INSERT INTO users (name, email, password, profile_image)
    VALUES (
      '${name}', '${email}', '${password}', '${profileImage}'
    )
  `)
	// 4. 응답(response) to client
  res.status(201).json({ message: 'USER_CREATED' })

})

// 1. app posting URL 
app.post('/postList', (req, res) => {
// 2. Receive data from client : 'title', 'content', 'userId'

  const title = req.body.title
  const content = req.body.content
  const userId = req.body.userId

// 3. Push data into array posts

  const postingData = {
    'title': title,
    'content': content,
    'userId': userId
  }

  posts.push(postingData)
// 4. Send response to client

  res.json({message: 'postCreated'})
})

// 1. app posting list get URL
app.get('/postList', (req, res) => {
  // Option 1
  // data 형태를 직접 만들어서, res.json()으로 보내주기

  const postingData = [
    {
      'id': 1
    }, {
      'id': 2
    }
  ]

  res.status(200).json({
    'data': postingData
  })
  res.status(200).json({
    "data" : [
      {
        "userID"           : 1,
        "userName"         : "Rebekah Johnson",
        "postingId" : 1,
        "postingTitle"     : "간단한 HTTP API 개발 시작!",
        "postingContent"   : "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현."
      },
      {  
        "userID"           : 2,
        "userName"         : "Fabian Predovic",
        "postingId"        : 2,
        "postingTitle"     : "HTTP의 특성",
        "postingContent"   : "Request/Response와 Stateless!!"
      },
      {  
        "userID"           : 3,
        "userName"         : "new user 1",
        "postingId"        : 3,
        "postingTitle"  : "내용 1",
        "postingContent"   : "sampleContent3"
      },
      {  
        "userID"           : 4,
        "userName"         : "new user 2",
        "postingId"        : 4,
        "postingTitle"  : "내용 2",
        "postingContent"   : "sampleContent4"
      }
    ]
  })
  // Option 2
  // array를 가공해서 형태에 맞는 데이터를 만든다.
})

// pseudo-code - 가짜코드

// 1. app 수정 url 등록
app.patch('/postList', (req, res) => {
  // 2. 1번이라는 숫자를 변수에 할당.
  const id = 1
  // 3. posts라는 배열에서, id가 1번인 객체를 찾음.

  for (let i = 0; i < posts.length; i++) {
    const posting = posts[i] // { 'id': 1, 'title': 'blahblah', 'content': '___' }
    // 만약 post라는 객체의 id가 1번이라면,
  // 4. 'content'를 'node'로 바꿔준다.
    if (posting.id === 1) {
      posting.content = 'node'
    }
  }

  res.status(200).json({data: posts})
  // 5. send response to client
})

const server = http.createServer(app)

try {
  server.listen(8000, () => {
    console.log('server is listening on PORT 8000')
  })
} catch(err) {
  console.log(err)
}