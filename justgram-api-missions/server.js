const http = require('http')
const express = require('express')
const dotenv = require("dotenv")
dotenv.config()
const { DataSource, SimpleConsoleLogger } = require('typeorm');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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

const app = express()

app.use(express.json())
app.get('/ping', (req, res) => {
  res.json({message: 'pong'})
})

app.get('/users', async (req, res) => {
  // database - order to get users
  // "SELECT * FROM users;"
  const userData = await myDataSource.query(`SELECT * FROM users;`)

  console.log('result: ', userData)
  // send data to client as a response
  res.status(200).json({ users: userData })

})

app.post('/join', async(req, res) => {
  try {
	  const { email, password, name, profileImage, phoneNumber, isAgreed } = req.body

    // 0. required variables check
    const REQUIRED_KEYS = { email , password, name, phoneNumber, isAgreed }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        throw new Error(`KEY_ERROR: ${key}`)
      }
    })

    const [_, foreNumber, laterNumber] = phoneNumber.split('-')
    if (password.includes(foreNumber) || password.includes(laterNumber)) {
      throw new Error('PASSWORD_INCLUDING_PHONE_NUMBER')
    }
    // 앞자리가 비밀번호에 포함되었는지, 뒷자리가 비밀번호에 포함되었는지.
    // A. 이미 database 상에 존재하는 Email로는 가입할 수 없음.
    // 1. SELECT로 기존 존재하는 유저를 db로부터 가져와서, 있으면 중복이므로 가입 불가, 없으면 가입 가능

    const user = await myDataSource.query(`
      SELECT id, email FROM users WHERE email = '${email}'
    `)

    if (user.length !==0) {
      throw new Error("USER_ALREADY_EXISTS")
    }

    console.log('before hashing: ', password)
    const hashedPw = bcrypt.hashSync(password, bcrypt.genSaltSync())
    console.log('after hashing: ', hashedPw)
     
    // 2. email UNIQUE -> db가 자동으로 중복 이메일 걸러줌.
    await myDataSource.query(`
      INSERT INTO users (name, email, password, profile_image)
      VALUES (
        '${name}', '${email}', '${hashedPw}', '${profileImage}'
      )
    `)   
    res.status(201).json({ message: 'USER_CREATED' })
  } catch(err) {
    console.log(err)
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({message: "USER_ALREADY_EXISTS"})
    }
    res.status(400).json({message: err.message})
  }
})

app.post('/login', async(req, res) => {

  try {
	  const { email, password } = req.body

    // 1. KEY_ERROR check
    const REQUIRED_KEYS = { email , password }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`)
        error.statusCode = 400
        throw error
      }
    })

    // 2. email, password validation <- front (double check)
    // 3. user existence check
    // db user SELECT <- WHERE : email
    const [existingUser] = await myDataSource.query(`
      SELECT id, email, password FROM users WHERE email = '${email}'
    `)

    if (!existingUser) {
      const error = new Error('USER_DOES_NOT_EXIST')
      error.statusCode = 404
      throw error
    }

    // 4. password isSame using compare method in bcrypt
    const isSame = bcrypt.compareSync(password, existingUser.password)

    console.log('isSamePassword: ', isSame)
    
    if (!isSame) {
      const error = new Error('INVALID_PASSWORD')
      error.statusCode = 400
      throw error
    }
    
    const token = jwt.sign({ id: existingUser.id }, process.env.SECRET_KEY)

    res.status(200).json({message: 'SUCCESS', token: token})

  } catch (err) {
    console.log(err)
    res.status(err.statusCode).json({message: err.message})
  }
})

// 1. app posting URL 
app.post('/posting', async (req, res) => {
// 2. Receive data from client : 'title', 'content'
  
  try {
    const { token } = req.headers
    const { title, content } = req.body

    const REQUIRED_KEYS = { title, content }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`)
        error.statusCode = 400
        throw error
      }
    })

    // 3. get token from header

    if (!token) {
      const error = new Error('LOGIN_REQUIRED')
      error.statusCode = 401 // unauthorized
      throw error
    }

    // 4. if token ==> jwt.verify

    const user = jwt.verify(token, process.env.SECRET_KEY)
    const userId = user.id

  // 5. userId, title, content 게시글 작성

    await myDataSource.query(`
      INSERT INTO posts (title, content, user_id) 
      VALUES ('${title}', '${content}', ${userId})
    `)

  } catch (err) {
    console.log(err)
    res.status(err.statusCode).json({message: err.message})
  }

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