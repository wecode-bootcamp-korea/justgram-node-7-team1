const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const { DataSource } = require("typeorm");
//const { validateToken } = require("./middleware/validateToken.js");

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  // entities: ["dist/**/**.entity{.ts,.js}"],
});

const app = express();
app.use(express.json());
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

const usermodel = require("../model/model");
//------------------우리가 정한 규칙------------------
const signup = async (email, password) => {
  const emailreg =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(emailreg)) {
    throw new Error("EMAIL_INVALID");
  }
  // 3. password 특수문자 포함
  const passwordVal = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{5,20}$/;
  if (!password.match(passwordVal)) {
    throw new Error("PASSWORD_INVALID");
  }
  const checkIdByEmail = await usermodel.getUserByEmail(email);

  if (checkIdByEmail.length !== 0) {
    throw new Error("CHECK_EMAIL");
  }
  const secPw = bcrypt.hashSync(password, salt);

  const createdUser = await usermodel.createUser(
    email,
    nickname,
    secPw,
    profile_image
  );
  return createdUser;
};

module.exports = {
  signup,
};
