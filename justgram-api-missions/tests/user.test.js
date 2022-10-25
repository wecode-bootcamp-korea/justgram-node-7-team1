// tests/user.test.js

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
  database: process.env.TYPEORM_DATABASE
})

describe("Sign Up", () => {
  let app;

  beforeAll(async () => {
    // 모든 테스트가 시작하기 전(beforeAll)에 app을 만들고, DataSource를 이니셜라이징 합니다.
    app = createApp();
    await myDataSource.initialize();
  });

  afterAll(async () => {
    // 테스트 데이터베이스의 불필요한 데이터를 전부 지워줍니다.
    await myDataSource.query(`TRUNCATE users`);

    // 모든 테스트가 끝나게 되면(afterAll) DB 커넥션을 끊어줍니다.
    await myDataSource.destroy();
  });

  // test("FAILED: invalid email", async () => {
  //   // supertest의 request를 활용하여 app에 테스트용 request를 보냅니다.
  //   await request(app)
  //     .post("/users/join") // HTTP Method, 엔드포인트 주소를 작성합니다.
  //     .send({ email: "shlee@justcode.co.kr", password: "password" }) // body를 작성합니다.
  //     .expect(400) // expect()로 예상되는 statusCode, response를 넣어 테스트할 수 있습니다.
  //     .expect({ message: "invalid email!" });
  // });

  // 다음과 같이 본인이 작성한 코드에 맞춰 다양한 케이스를 모두 테스트해야 합니다.
  // 그래야 의도에 맞게 코드가 잘 작성되었는지 테스트 단계에서부터 확인할 수 있습니다!

  const userData = { 
		email: "wecode001@gmail.com", password: "password001@", name: "soheon lee"
	}

  test("SUCCESS: created user", async () => {
    await request(app)
      .post("/users/join")
      .send(userData)
      .expect(201);
  });

  test("FAIL: duplicated user", async () => {
    await request(app)
      .post("/users/join")
      .send(userData)
      .expect(409)
			.expect({messge: "DUPLICATED_USER"});
  });

  test("FAILED: key error - no email", async () => {
    await request(app)
      .post("/users/join")
      .send({ password: "password001@", name: 'soheon lee' })
      .expect(400)
      .expect({ message: "KEY_ERROR: email" });
  });

  test("FAILED: key error - no password", async () => {
    await request(app)
      .post("/users/join")
      .send({ email:'so lee @justcode', name: 'soheon lee' })
      .expect(400)
      .expect({ message: "KEY_ERROR: password" });
  });
});