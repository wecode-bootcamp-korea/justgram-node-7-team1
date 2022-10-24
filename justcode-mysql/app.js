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

const controller = require("./controller/controller");
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

//유저 추가
app.post("/join", controller.signup);

//미션 5 유저 로그인
app.post("/login", async (req, res) => {
  try {
    //----------------------------C------------------------------
    const { login_id, login_password } = req.body;

    //키 확인
    const login_keys = { login_id, login_password };

    Object.keys(login_keys).map((key) => {
      if (!login_keys[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });

    //----------------------------M------------------------------
    //로그인 id 형식 확인
    const emailreg =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!login_id.match(emailreg)) {
      throw new Error("이메일 형식으로 작성바랍니다.");
    }
    //password 형식 확인
    const passwordVal = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{5,20}$/;
    if (!login_password.match(passwordVal)) {
      throw new Error("비밀번호에 글자, 숫자, 특수문자를 포함해 주세요");
    }

    //----------------------------S------------------------------
    //유저 id 확인
    const checkid = await myDataSource.query(
      `select email from users where email = '${login_id}'`
    );
    if (checkid.length === 0) {
      throw new Error("존재하지 않는 아이디입니다.");
    }
    //비밀번호 확인

    const get_data = await myDataSource.query(
      `select id, password from users where email = '${login_id}'`
    );

    //----------------------------M------------------------------
    const check_pw = bcrypt.compareSync(login_password, get_data[0].password);

    if (!check_pw) {
      throw new Error("비밀번호가 틀렸습니다");
    }
    //토큰 발행
    const token = jwt.sign({ id: get_data[0].id }, secret_key);
    //-----------------------------------------------------------------
    res.status(200).json({ message: "로그인 성공", token: token });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

//미션4
//포스팅 추가
app.post("/posting", async (req, res) => {
  try {
    //----------------------------C------------------------------
    const { contents } = req.body;
    const { token } = req.headers;

    // 1. 정보가 다 들어왔는지

    const posting_required_keys = { contents };

    Object.keys(posting_required_keys).map((key) => {
      if (!posting_required_keys[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });
    // 2. 로그인 했는지
    if (!token) {
      throw new Error("ERROR: LOGIN_REQUESTED");
    }
    //----------------------------M------------------------------
    // 3. 토큰으로 로그인 아이디 넣기
    const user = jwt.verify(token, secret_key);
    const user_ID = user.id;

    //----------------------------S------------------------------
    const result = await myDataSource.query(
      `insert into postings(user_id, contents) values( '${user_ID}', '${contents}')`
    );

    res.status(200).json({ message: "post Created" });
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
});
//(전체)게시글 들고오기
app.get("/post", async (req, res) => {
  try {
    //1. 로그인해야 게시글 볼 수 있음.
    const { token } = req.headers;
    if (!token) {
      throw new Error("로그인!");
    }
    //
    const getpost = await myDataSource.query(
      `select postings.user_id, users.profile_image, posting_images.posting_id, posting_images.image_url, postings.contents from users inner join postings on users.id = postings.user_id inner join posting_images on postings.id = posting_images.posting_id`
    );

    console.log("data : ", getpost);

    res.status(200).json({ users: getpost });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
});
//게시글 수정하기
app.patch("/update", async (req, res) => {
  try {
    const { id, content } = req.body;
    const { token } = req.headers;
    //1. 일단 로그인 여부 먼저
    if (!token) {
      throw new Error("로그인!!");
    }
    //2. 정보가 다 들어오는지(id는 포스팅게시글 번호)
    const update_required_keys = { id, content };

    Object.keys(update_required_keys).map((key) => {
      if (!update_required_keys[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });
    // 3. 토큰으로 로그인 아이디 들고오기
    const user = jwt.verify(token, secret_key);
    const user_ID = user.id;
    // 4. 데이터 넣기
    const updatepost = await myDataSource.query(
      `UPDATE postings SET contents='${content}' WHERE user_id=${user_ID} AND id=${id}; 
    `
    );
    const afterUpdate = await myDataSource.query(`select * from postings`);
    res.status(200).json({ data: afterUpdate });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
});
// 게시글 삭제
app.delete("/deletePost", async (req, res) => {
  try {
    const { postingsId } = req.body;
    const { token } = req.headers;
    //1. 로그인 여부 확인
    if (!token) {
      throw new Error("로그인!!");
    }
    // 2. 데이터가 잘 들어오는지

    const update_required_keys = { postingsId };

    Object.keys(update_required_keys).map((key) => {
      if (!update_required_keys[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });
    // 3. 자기 게시글만 지울 수 있게 하기
    const user = jwt.verify(token, secret_key);
    const user_ID = user.id;

    const [IDmatchUsersT] = await myDataSource.query(
      `select id from users where id = ${user_ID}`
    );
    const [IDmatchPostingsT] = await myDataSource.query(
      `select user_id from postings where id = '${postingsId}'`
    );
    // 잠깐 게시물이 존재하는지 확인
    if (!IDmatchPostingsT) {
      throw new Error("삭제된 계시물입니다");
    }
    //
    if (IDmatchPostingsT.user_id !== IDmatchUsersT.id) {
      throw new Error("자기 게시글만 삭제하기");
    }

    const result = await myDataSource.query(
      `delete from postings where id = '${postingsId}'`
    );
    res.status(200).json({ message: "post Deleted" });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
});

const server = http.createServer(app);

try {
  server.listen(8000, () => {
    console.log("server is listening on PORT 8000");
  });
} catch (err) {
  console.log(err);
  res.json({ message: err.message });
}
