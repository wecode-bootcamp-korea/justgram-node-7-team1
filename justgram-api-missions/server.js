const http = require('http')
const express = require('express')
const dotenv = require("dotenv")
dotenv.config()

const router = require('./routers')

const app = express()

app.use(express.json())
app.use(router)

const server = http.createServer(app)

try {
  server.listen(8000, () => {
    console.log('server is listening on PORT 8000')
  })
} catch(err) {
  console.log(err)
}
