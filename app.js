const http = require("http")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")
const bcrypt = require("bcryptjs")
var jwt = require("jsonwebtoken")
const userController = require ("./controllers/userControllers")
const router = require("./routers")

dotenv.config()

const app = express();

app.use(express.json());
app.use(router)

const validateToken = async(req, res, next) => {
    try {
      const { token } = req.headers
  
      if (!token) {
        const error = new Error('LOGIN_REQUIRE')
        error.statusCode = 401 // unauthorized
        throw error
      }
  
  
      const user = jwt.verify(token, process.env.SECRET_KEY)
  
  
      console.log('user id: ', user.id)
  
      const [userData] = await myDataSource.query(`
        SELECT id, email FROM users WHERE id = ${user.id}
      `)
  
      console.log('user data: ', userData)
  
      if (userData === undefined) {
        const error = new Error('USER_INVALID')
        error.statusCode = 404
        throw error
      }
  
      req.userInfo = userData
  
      next();
    } catch (err) {
      console.log(err)
      res.status(err.statusCode).json({message: err.message})
    }
  }

// 전체 유저 데이터 조회
app.get("/users", async(req,res)=>{
    const userData = await myDataSource.query(`
        SELECT * from users;
    `)
    res.json(userData)
})


// 유저 로그인
app.post("/login", userController.login);

// 게시물 생성
app.post("/createpost", validateToken, async (req, res) => {
    try{
        const { content } = req.body;


        const REQUIRED_KEYS = [ content ]
        Object.keys(REQUIRED_KEYS).map((key) => {
            if (!REQUIRED_KEYS[key]) {
                throw new Error(`KEY ERROR : ${key}`)
            }
        })

        if (!token){
            const error = new Error('LOGIN_REQUIRED')
            error.statusCode = 401
            throw error
        }
        
        const userID = user.id
        const Data = await myDataSource.query(`
          INSERT INTO postings (user_id, contents) values (${userID}, '${content}')
        `);
        res.json({ message: "postCreated" });
    } catch(err){
        res.status(err.statusCode).json({message:err.message})
    }

    
});

// 전체 게시글 조회
app.get("/postList", validateToken, async (req, res) => {
    const postdata = await myDataSource.query(`
      SELECT users.id AS userId,
      users.profile_image AS userProfileImage,
        postings.id AS postingId,
        posting_images.image_url AS postingImageUrl,
        postings.contents AS postingContent
      FROM postings
      JOIN users ON users.id = postings.user_id
      LEFT JOIN posting_images ON posting_images.posting_id = postings.id
    `);
  
    res.json({ data: postdata });
  });

// user의 게시글 조회
app.post("/postList", validateToken ,async (req, res) => {
    const { id } = req.body;
    const postdata = await myDataSource.query(`
      SELECT
        postings.id AS postingId,
        posting_images.image_url AS postingImageUrl,
        postings.contents AS postingContent
      FROM postings
      JOIN users ON users.id = postings.user_id
      LEFT JOIN posting_images ON posting_images.posting_id = postings.id
      WHERE users.id = '${id}'
    `);
    const [profiledata] = await myDataSource.query(`
      SELECT profile_image FROM users where id = ${id}
    `);
    res.json({
      data: {
        userId: id,
        userProfileImage: profiledata.profile_image,
        postings: postdata,
      },
    });
  });

// 게시글 삭제
  app.delete("/deletepost", async (req, res) => {
    const { id } = req.body;
    const data = await myDataSource.query(`
      DELETE FROM postings WHERE id=${id}
    `);
    res.json({ message: "postingDelected" });
  });


const server = http.createServer(app);

server.listen(8000, '127.0.0.1', () =>{
    console.log("server is listening on PORT 8000")
})