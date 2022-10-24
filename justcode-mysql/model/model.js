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
});

const app = express();
app.use(express.json());
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

//-----------------------sql 사용하는거------------------------
const getUserByEmail = async (email) => {
  const userDupl = await myDataSource.query(
    `select email from users where email = '${email}'`
  );
  return userDupl;
};

const createUser = async (email, nickname, secPw, profile_image) => {
  const result = await myDataSource.query(
    `INSERT INTO users (email, nickname, password, profile_image) VALUES('${email}', '${nickname}', '${secPw}', '${profile_image}' )`
  );
  return result;
};

module.exports = {
  getUserByEmail,
  createUser,
};
