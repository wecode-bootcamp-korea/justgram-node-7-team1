const http = require('http')
const express = require('express')

const app = express()

app.use(express.json())

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

app.get('/ping', (req, res) => {
  res.json({message: 'pong'})
})

app.post('/users/signup', (req, res) => {
  try {

  const { name, email, password } = req.body

    users.push({
      'id': users.length + 1,
      'name' : name,
      'email' : email,
      'password' : password
    })

    res.setHeader('Content-Type', 'application/json')

    res.json({ message: 'USER_CREATED', data: users })
  } catch (err) {
    console.log(err)
  }
})

const server = http.createServer(app)

try {
  server.listen(8000, () => {
    console.log('server is listening on PORT 8000')
  })
} catch(err) {
  console.log(err)
}