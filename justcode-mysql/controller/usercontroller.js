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

    res.status(200).json({ message: "SUCCESSED_LOGIN", token: result });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

const posting = async (req, res) => {
  try {
    const { contents } = req.body;
    const { token } = req.headers;

    const posting_required_keys = { contents };

    Object.keys(posting_required_keys).map((key) => {
      if (!posting_required_keys[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });

    if (!token) {
      throw new Error("ERROR: LOGIN_REQUESTED");
    }

    const result = await userServices.posting(token, contents);

    res.status(200).json({ message: "post Created" });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

const getPost = async (req, res) => {
  try {
    const { token } = req.headers;
    if (!token) {
      throw new Error("로그인 해주세요");
    }
    const result = await userServices.getPost(token);
    res.status(200).json({ post: result });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id, contents } = req.body;
    const { token } = req.headers;
    //1. 일단 로그인 여부 먼저
    if (!token) {
      throw new Error("로그인!!");
    }
    //2. 정보가 다 들어오는지(id는 포스팅게시글 번호)
    const update_required_keys = { id, contents };

    Object.keys(update_required_keys).map((key) => {
      if (!update_required_keys[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });
    const result = await userServices.update(token, id, contents);
    res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postingsId } = req.body;
    const { token } = req.headers;
    //1. 로그인 여부 확인
    if (!token) {
      throw new Error("로그인 해주세요");
    }
    // 2. 데이터가 잘 들어오는지

    const update_required_keys = { postingsId };

    Object.keys(update_required_keys).map((key) => {
      if (!update_required_keys[key]) {
        throw new Error(`KEY_ERROR: ${key}`);
      }
    });
    const result = await userServices.deletePost(token, postingsId);

    res.status(200).json({ message: "post Deleted" });
  } catch (err) {
    console.log(err);
    res.json({ message: err.message });
  }
};

module.exports = {
  signup,
  login,
  posting,
  getPost,
  update,
  deletePost,
};
