const service_set = require('../services');

const {userSvc} = service_set;

const {checkDataIsNotEmpty} = require('../utils/myutils');

async function login(req, res) {
  const {email, password} = req.body;
  checkDataIsNotEmpty({email, password});

  const token = await userSvc.login(email, password);
  res.status(200).send({message: 'login Success',token});
}

async function addUser(req, res) {

  const { email, nickname, password, profile_image = 'none'} = req.body;
  checkDataIsNotEmpty({email, nickname, password});
  const userInfo = {email, nickname, password, profile_image};
  await userSvc.addUser(userInfo);
  const token = await userSvc.login(email, password);
  res.status(201).json({ message: "successfully created", token });
}

async function getAllUser(req, res) {
  const allUser = await userSvc.getAllUser();
  res.status(200).send(allUser);
}
async function test(req, res) {
  console.log(`userInfo: ${JSON.stringify(req.userInfo)}`);
  res.send("TEST");
}

module.exports = {
  test,
  login,
  addUser,
  getAllUser,
}