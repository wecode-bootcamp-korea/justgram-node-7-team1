// tests/user.test.js

// npm i --save-dev supertest
const  request = require("supertest");
const  { createApp } = require("../src/app");
import database from "../src/models/database"

describe("Sign Up", () => {
  const app = createApp();

  beforeAll(async () => {
    await database.initialize();
    await database.query(`SET foreign_key_checks = 0`);
    await database.query(`TRUNCATE users`);
  });

  afterAll(async () => {
    await database.query(`TRUNCATE users`);
    await database.query(`SET foreign_key_checks = 1`);
    await database.destroy();
  });

  test("계정 생성 성공", async () => {
    await request(app)
      .post("/user")
      .send({
        email: "test@gmail.com",
        password: "dddd",
        nickname: "testNick",
      })
      .expect(201);
  });
});