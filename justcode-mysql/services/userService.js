const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

const usermodel = require("../model/userDao");
//------------------우리가 정한 규칙------------------
const signup = async (email, password, nickname, profile_image) => {
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
    secPw,
    nickname,
    profile_image
  );
  return createdUser;
};

const login = async (email, password) => {
  //로그인 id 형식 확인
  const emailreg =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email.match(emailreg)) {
    throw new Error("이메일 형식으로 작성바랍니다.");
  }

  //password 형식 확인
  const passwordVal = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^*+=-]).{5,20}$/;
  if (!password.match(passwordVal)) {
    throw new Error("비밀번호에 글자, 숫자, 특수문자를 포함해 주세요");
  }

  const checkIdByEmail = await usermodel.getUserByEmail(email);
  if (checkIdByEmail.length === 0) {
    throw new Error("CHECK_EMAIL");
  }

  const check_pw = await usermodel.getUserData(email);

  const checkPwByEmail = bcrypt.compareSync(password, check_pw[0].password);
  if (!checkPwByEmail) {
    throw new Error("비밀번호가 틀렸습니다");
  }
  const token = jwt.sign({ id: check_pw.id }, secret_key);

  return token;
};

module.exports = {
  signup,
  login,
};
