const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync();
const jwt = require("jsonwebtoken");
const secret_key = process.env.SECRET_KEY;

const postmodel = require("../model/postDao");
//-------------------------------------------------------------------------------

const posting = async (token, contents) => {
  const user = jwt.verify(token, secret_key);
  const user_ID = user.id;
  const postingContents = await postmodel.getContentForPosting(
    user_ID,
    contents
  );

  return postingContents;
};

const getPost = async (token) => {
  const result = await postmodel.getAllPost(token);
  return result;
};

const update = async (token, id, contents) => {
  const user = jwt.verify(token, secret_key);
  const user_ID = user.id;
  const postUpdate = await postmodel.update(id, contents, user_ID);
  const after = await postmodel.afterUpdate(id);
  return postUpdate, after;
};

const deletePost = async (token, postingsId) => {
  const user = jwt.verify(token, secret_key);
  const user_ID = user.id;

  const userId = await postmodel.postingsUser_Id(postingsId);
  console.log(userId[0]);
  if (!userId[0]) {
    throw new Error("삭제된 계시물입니다");
  }
  if (userId[0].user_id !== user_ID) {
    throw new Error("자기 게시글만 삭제하기");
  }
  const result = await postmodel.deletePost(postingsId);
  return result;
};
//-------------------------------------------------------------------------------
module.exports = {
  posting,
  getPost,
  update,
  deletePost,
};
