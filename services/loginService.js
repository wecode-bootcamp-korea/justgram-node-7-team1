const loginDao = require('../models/loginDao')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (email, password) => {
  const dbUser = await loginDao.findDbUser(email)
  if (!dbUser) {
    const error = new Error('USER_DOES_NOT_EXIST')
    error.statusCode = 404
    throw error
  }
  const pwSame = bcrypt.compareSync(password, dbUser.password)
  if (!pwSame) {
    const error = new Error('INVALID_PASSWORD')
    error.statusCode = 400
    throw error
  }

    //받은 요청의 id와 password로 DB에서 프로필사진, 닉네임 등 로그인 정보를 가져온다.
  const name = dbUser.name;
  const profile = dbUser.profile_image;
  const id = dbUser.id;
  token = jwt.sign({
    type: 'JWT',
    name: name,
    profile: profile,
    id: id
  }, process.env.SECRET_KEY, {
    expiresIn: '15m', // 만료시간 15분
    issuer: '토큰발급자',
  });
}

module.exports = {
  loginUser
}