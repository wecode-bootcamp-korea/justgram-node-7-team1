// npm i --save-dev supertest
const request = require("supertest");

// supertest의 request에 app을 담아 활용하기 위해 createApp 함수를 불러옵니다.
const { createApp }  = require('../app');
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

  test("SUCCESS: created user", async () => {
    await request(app)
      .post("/user/signup")
      .send({ email: "k3ji0706@justcode.kr", password: "123ksdaf2ss3", password1: "123ksdaf2ss3", name:"k3ji0706", profile_image:"http://ddbdbddb.jpeg" })
      .expect(201)
      .expect({ message: "userCreated" });
  });

  // 다음과 같이 본인이 작성한 코드에 맞춰 다양한 케이스를 모두 테스트해야 합니다.
  // 그래야 의도에 맞게 코드가 잘 작성되었는지 테스트 단계에서부터 확인할 수 있습니다!

  test("FAILED: not Same password", async () => {
    await request(app)
      .post("/user/signup")
      .send({ email: "k3ji0706@justcode.kr", password: "password001", password1: "password001@", name:"kjs", profile_image:"http://profile1.co.kr" })
      .expect(400)
      .expect({ message: "PASSWORD_DONT_SAME" });
  });
});

  // test("FAILED: invalid email", async () => {
  //   // supertest의 request를 활용하여 app에 테스트용 request를 보냅니다.
  //   await request(app)
  //     .post("/user/signup") // HTTP Method, 엔드포인트 주소를 작성합니다.
  //     .send({ email: "k3ji0706@justcode.kr", password: "password001@", password1: "password001@", name:"kjs", profile_image:"http://profile1.co.kr" }) // body를 작성합니다.
  //     .expect(400) // expect()로 예상되는 statusCode, response를 넣어 테스트할 수 있습니다.
  //     .expect({ message: 'USER_ALREADY_EXISTS' }); 
  // });
