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
const userServices = require("../services/userService");
//-------------프론트에서 들고 오는 거---------------------
// 1. signup정보가 다 들어왔는지
const signup = async (req, res) => {
  try {
    const { email, password, nickname, profile_image } = req.body;
    const required_keys = { email, password, nickname, profile_image };

    Object.keys(required_keys).map((key) => {
      if (!required_keys[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });

    const result = await userServices.signup(
      email,
      password,
      nickname,
      profile_image
    );

    res.status(200).json({ message: "user_created" });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const login_keys = { email, password };

    Object.keys(login_keys).map((key) => {
      if (!login_keys[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });

    const result = await userServices.login(email, password);

    res.status(200).json({ message: "SUCCESSED_LOGIN" });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

module.exports = {
  signup,
  login,
};
