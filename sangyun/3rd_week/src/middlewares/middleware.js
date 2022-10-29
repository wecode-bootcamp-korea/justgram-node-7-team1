const  jwt = require('jsonwebtoken');
const service = require('../services');

async function authMiddleware(req, _, next) {
	const token = req.headers.authorization;
	const decodedToken = decodeToken(token);
  const userInfo = await service.userSvc.findUserById(decodedToken.id);
  req.userInfo = userInfo;
  next();
}

async function adminMiddleware(req, _, next){
  const userInfo = req.userInfo;
  if (userInfo.email != "sororiri@gmail.com") {
    throw {status: 403, message: "not permitted"};
  }
  next();
}

function decodeToken(token) {
  try {
    return jwt.verify(token, 'server_made_secret_key');
  } catch (err) {
    console.log(`err: ${err}`);
    throw {status: 401, message: "unauthorized"}
  }
}

// error handling 미들웨어
const errorHandler =
    (err, _1, res, _2) => {
      // 흐름상 에러가 검출되면 로그 표시 및 클라이언트에게 전달
      let responseInfo = err;
      if (err.sqlMessage) {
        console.log(err.sqlMessage);
        responseInfo = {...err, status: 500, message: "failed"};
      }
      console.log("err LOG:", err);
      res.status(responseInfo.status || 500).send({ message: responseInfo.message || '' });
    };

module.exports =  {
  authMiddleware,
  adminMiddleware,
  errorHandler
}