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

const userController = require('./controllers/userController')



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
try {
  app.get('/users', async (req, res) => {
    const userData = await myDataSource.query(`SELECT * FROM users;`);
    console.log(userData)
    res.status(200).json({ users: userData })
  });
} catch (err) {
  console.log(err)
}


// 유저 생성
app.post('/signup', userController.createUser)

// 로그인하기

// POST /login 요청 body에 id와 password를 함께 실어서 요청으로 가정 (사실 id와 password는 암호화 되어있음)

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const REQUIRED_KEYS = { email, password }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`)
        error.statusCode = 400
        throw error
      }
    })

    const [dbUser] = await myDataSource.query(`
    SELECT id, email, name, password, profile_image
      FROM users WHERE email = '${email}'
      `)

    if (!dbUser) {
      const error = new Error('USER_DOES_NOT_EXIST')
      error.statusCode = 404
      throw error
    }

    const pwSame = bcrypt.compareSync(password, dbUser.password)
    console.log('isSamePassword: ', pwSame)

    if (!pwSame) {
      const error = new Error('INVALID_PASSWORD')
      error.statusCode = 400
      throw error
    }

    //받은 요청의 id와 password로 DB에서 프로필사진, 닉네임 등 로그인 정보를 가져온다.
    const name = dbUser.name;
    const profile = dbUser.profile_image;
    const id = dbUser.id;
    token = jwt.sign({
      type: 'JWT',
      name: name,
      profile: profile,
      id: id
    }, process.env.SECRET_KEY, {
      expiresIn: '15m', // 만료시간 15분
      issuer: '토큰발급자',
    });

    //response
    res.status(200).json({
      code: 200,
      message: '토큰이 발급되었습니다.',
      token: token
    });
  } catch (err) {
    console.log(err)
    res.status(err.statusCode).json({ message: err.message })
  }
}
app.post('/login', loginUser)


const auth = (req, res, next) => {
  // 인증 완료
  try {
    // 요청 헤더에 저장된 토큰(req.headers.authorization)과 비밀키를 사용하여 토큰을 req.decoded에 반환
    req.decoded = jwt.verify(req.headers.authorization, process.env.SECRET_KEY);
    next();
  }
  // 인증 실패
  catch (error) {
    // 유효시간이 초과된 경우
    if (error.name === 'TokenExpiredError') {
      res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.'
      });
    }
    // 토큰의 비밀키가 일치하지 않는 경우
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({
        code: 401,
        message: '유효하지 않은 토큰입니다.'
      });
    }
  }
}

const tokenCheck = (req, res) => {
  const name = req.decoded.name;
  const profile = req.decoded.profile;
    res.status(200).json({
    code: 200,
    message: '토큰은 정상입니다.',
    data: {
      name: name,
      profile: profile
    }
  });
}
app.get('/payload', auth, tokenCheck)

// 게시물 보여주기
const showList = async (req, res) => {
  try {
    const { token } = req.headers

    if (!token) {
      const error = new Error('LOGIN_REQUIRED')
      error.statusCode = 401
      throw error
    }
    const listData = await myDataSource.query(`
    SELECT users.id, users.profile_image, posting_images.posting_id, posting_images.image_url, posts.contents 
    FROM users 
    INNER JOIN posts ON posts.user_id = users.id 
    INNER JOIN posting_images ON posting_images.posting_id = posts.id;
  `);
    console.log(listData)
    res.status(200).json({ data: listData })
  } catch (err) {
    console.log(err);
  }
};
app.get('/list', showList);

// 게시물 생성
const createPost = async (req, res) => {
  try {
    const { token } = req.headers
    const { title, contents } = req.body

    const REQUIRED_KEYS = { title, contents }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`)
        error.statusCode = 400
        throw error
      }
    })

    const user = jwt.verify(token, process.env.SECRET_KEY)
    const userId = user.id

    await myDataSource.query(`
      INSERT INTO posts (user_id, title, contents) 
      VALUES ('${userId}', '${title}', '${contents}')
    `)
  } catch (err) {
    console.log(err)
    res.status(err.statusCode).json({ message: err.message })
  }
  res.status(201).json({ message: "postCreated" })
}
app.post('/posts', auth, createPost)

// 게시글 업데이트
const updateList = async (req, res) => {
  try {
    const { id, contents } = req.body

    const REQUIRED_KEYS = { id, contents }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`)
        error.statusCode = 400
        throw error
      }
    })

    await myDataSource.query(
      `UPDATE posts SET 
      contents = '${contents}' 
      WHERE id= '${id}';`
    );
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message })
  }
  res.status(201).json({ message: "successfully updated" });
};
app.post('/update', auth, updateList);

// 게시글 삭제
const postDELETE = async (req, res) => {
  try {
    const { id, title, contents } = req.body;
    const REQUIRED_KEYS = { id, title, contents }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`)
        error.statusCode = 400
        throw error
      }
    })

    await myDataSource.query(
      `DELETE FROM posts WHERE id = '${id}';
		`);

  } catch (err) {
    console.log(err)
    res.status(err.statusCode).json({ message: err.message })
  }
  res.status(204).json({ message: "posting deleted" });
};
app.post('/delete', auth, postDELETE);

const server = http.createServer(app);

try {
  server.listen(8000, () => {
    console.log('server is listening on PORT 8000');
  })
} catch (err) {
  console.log(err);
}
