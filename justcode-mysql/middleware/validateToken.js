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
  // entities: ["dist/**/**.entity{.ts,.js}"],
});

myDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
});

const app = express();
app.use(express.json());
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

const validateToken = async (req, res, next) => {
  try {
    const { token } = req.heaeders;

    if (!token) {
      const err = new Error("토큰없음");
      err.statuscode(400);
      throw err;
    }

    const user = jwt.verify(token, secret_key);
    const userId = user.id;
    const userdata = await myDataSource.query(
      `select id, email from users where(id = '${userId}')`
    );
    if (!userdata) {
      const err = new Error("유저없음");
      err.statuscode(400);
      throw err;
    }
    req.userinfo = userdata;
    next();
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
  }
};

module.exports = { validateToken };
