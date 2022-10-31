// npm i --save-dev supertest
const request = require("supertest");

// supertest의 request에 app을 담아 활용하기 위해 createApp 함수를 불러옵니다.
const { createApp } = require("../app");
const { DataSource } = require("typeorm");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
});

//----------------------회원가입------------------------------------
describe("Sign Up", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    await myDataSource.query(`SET foreign_key_checks = 0`);
    await myDataSource.query(`TRUNCATE users`);
    await myDataSource.destroy();
  });
  // 이메일 형식 불충족
  test("FAILED: invalid email", async () => {
    await request(app)
      .post("/users/join")
      .send({
        email: "wrongEmail",
        password: "password001@",
        nickname: "Name11",
        profile_image: "image",
      })
      .expect({ message: "EMAIL_INVALID" });
  });
  // 비밀번호 형식 불충족
  test("FAILED: invalid password", async () => {
    await request(app)
      .post("/users/join")
      .send({
        email: "wecode001@gmail.com",
        password: "password",
        nickname: "Name11",
        profile_image: "image",
      })
      .expect({ message: "PASSWORD_INVALID" });
  });
  // 성공
  test("SUCCESS: created user", async () => {
    await request(app)
      .post("/users/join")
      .send({
        email: "wecode001@gmail.com",
        password: "password001@",
        nickname: "Name11",
        profile_image: "image",
      })
      .expect(200);
  });
  //email 중복
  test("FAILED: duplicated email", async () => {
    await request(app)
      .post("/users/join")
      .send({
        email: "wecode001@gmail.com",
        password: "password001@",
        nickname: "Name11",
        profile_image: "image",
      })
      .expect({ message: "CHECK_EMAIL" });
  });
  // 필수 입력 조건 불충족
  test("FAILED: password did not input", async () => {
    await request(app)
      .post("/users/join")
      .send({
        email: "wrongEmail",
        nickname: "Name11",
      })
      .expect({ message: `KEY_ERROR: password` });
  });
  test("FAILED: email did not input", async () => {
    await request(app)
      .post("/users/join")
      .send({
        password: "password001@",
        nickname: "Name11",
      })
      .expect({ message: `KEY_ERROR: email` });
  });
  test("FAILED: nickname did not input", async () => {
    await request(app)
      .post("/users/join")
      .send({
        email: "wrongEmail",
        password: "password001@",
      })
      .expect({ message: `KEY_ERROR: nickname` });
  });
});

//----------------------로그인------------------------------------
describe("Login", () => {
  let app;

  beforeAll(async () => {
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    await myDataSource.query(`SET foreign_key_checks = 0`);
    await myDataSource.query(`TRUNCATE users`);
    await myDataSource.destroy();
  });
  // 이메일 형식 불충족
  test("FAILED: invalid email", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "wrongEmailgmail.com",
        password: "password001@",
      })
      .expect({ message: "이메일 형식으로 작성바랍니다." });
  });
  // 비밀번호 형식 불충족
  test("FAILED: invalid password", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "wecode001@gmail.com",
        password: "password001",
      })
      .expect({ message: "비밀번호에 글자, 숫자, 특수문자를 포함해 주세요" });
  });
  // 필수 입력 조건 불충족
  test("FAILED: password did not input", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "wecode001@gmail.com",
      })
      .expect({ message: `KEY_ERROR: password` });
  });
  test("FAILED: email did not input", async () => {
    await request(app)
      .post("/users/login")
      .send({
        password: "password001@",
      })
      .expect({ message: `KEY_ERROR: email` });
  });
  // 성공
  test("SUCCESS: successed login", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "wecode001@gmail.com",
        password: "password001@",
      })
      .expect(200);
  });
  //이메일 틀림
  test("FAILED: not exist email", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "wecode0011@gmail.com",
        password: "password001@",
      })
      .expect({ message: "CHECK_EMAIL" });
  });
  // 비밀번호 틀림
  test("FAILED: not exist password", async () => {
    await request(app)
      .post("/users/login")
      .send({
        email: "wecode001@gmail.com",
        password: "!password001",
      })
      .expect({ message: "CHECK_EMAIL" });
    // .expect({ message: "CHECK_PASSWORD" });
  });
});
