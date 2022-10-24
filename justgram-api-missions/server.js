const http = require('http')
const express = require('express')
const dotenv = require("dotenv")
dotenv.config()
const { DataSource } = require('typeorm');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userController = require('./controllers/userController')

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

const validateToken = async(req, res, next) => {
  // 3. get token from header
  try {
    const { token } = req.headers

    if (!token) {
      const error = new Error('LOGIN_REQUIRE')
      error.statusCode = 401 // unauthorized
      throw error
    }

    // 4. if token ==> jwt.verify

    const user = jwt.verify(token, process.env.SECRET_KEY)

    // 5. 해당 userId를 가진 유저가 실제로 존재하는지 .

    const [userData] = await myDataSource.query(`
      SELECT id, email FROM users WHERE id = ${user.id}
    `)

    if (!userData) {
      const error = new Error('USER_INVALID')
      error.statusCode = 404
      throw error
    }

    req.userInfo = userData

    next();
  } catch (err) {
    console.log(err)
    if (err.message === 'invalid signature') {
      err.statusCode = 400
      err.message = 'INVALID_SIGNATURE'
    } 
    res.status(err.statusCode || 500).json({message: err.message})
  }
}

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

app.post('/join', userController.signUp)

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
app.post('/posting', validateToken, async (req, res) => {
// 2. Receive data from client : 'title', 'content'
  try {

    const userId = req.userInfo.id
    const { title, content } = req.body

    const REQUIRED_KEYS = { title, content }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`)
        error.statusCode = 400
        throw error
      }
    })

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
app.get('/postList', validateToken, async (req, res) => {
  // Option 1
  // data 형태를 직접 만들어서, res.json()으로 보내주기
})

// pseudo-code - 가짜코드

// 1. app 수정 url 등록
app.patch('/postList', validateToken, async (req, res) => {
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
