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

const userServices = require("../services/service");
//-------------프론트에서 들고 오는 거---------------------
// 1. signup정보가 다 들어왔는지
const signup = async (req, res) => {
  try {
    const { email, nickname, password, profile_image } = req.body;
    const required_keys = { email, nickname, password, profile_image };

    Object.keys(required_keys).map((key) => {
      if (!required_keys[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });

    const result = userServices.signup(email, password);

    res.status(200).json({ message: "user_created" });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

module.exports = {
  signup,
};
