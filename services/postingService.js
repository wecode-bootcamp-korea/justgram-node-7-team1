const postingDao = require('../models/postingDao')

const showList = async() => {
  return postingDao.showList()
}

const createPost = async (userId, title, contents) => {
  const posting = await postingDao.createPost(userId, title, contents)
  return posting
}

const updatePost = async (id, contents) => {
  const updatePosting = postingDao.updatePost(id, contents)
  return updatePosting
}

const deletePost = async (id, title, contents) => {
  const deletePosting = await postingDao.deletePost(id)
  return deletePosting
}

module.exports = {
  showList,
  createPost,
  updatePost,
  deletePost
}