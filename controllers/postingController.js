const postingService = require('../services/postingService')

const getList = async (req, res) => {
  try {
    const result = await postingService.showList()
    res.status(200).json({ data: result })
  } catch (err) {
    console.log(err)
  }
}

const createPost = async (req, res) => {
  try {
    const { title, contents } = req.body

    const REQUIRED_KEYS = { title, contents }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`)
        error.statusCode = 400
        throw error
      }
    })

    const userId = req.decoded.id

    const result = await postingService.createPost(userId, title, contents)
  } catch (err) {
    console.log(err)
    res.status(err.statusCode).json({ message: err.message })
  }
  res.status(201).json({ message: "postCreated" })
}

const updatePost = async (req, res) => {
  try {
    const { id, contents } = req.body

    const REQUIRED_KEYS = { id, contents }

    Object.keys(REQUIRED_KEYS).map((key) => {
      if (!REQUIRED_KEYS[key]) {
        const error = new Error(`KEY_ERROR: ${key}`)
        error.statusCode = 400
        throw error
      }
    })

    const result = await postingService.updatePost(id, contents)
  } catch (err) {
    console.log(err);
    res.status(err.statusCode).json({ message: err.message })
  }
  res.status(201).json({ message: "successfully updated" });
}

const deletePost = async (req, res) => {
  try {
      const { id, title, contents } = req.body;
  const REQUIRED_KEYS = { id, title, contents }

  Object.keys(REQUIRED_KEYS).map((key) => {
    if (!REQUIRED_KEYS[key]) {
      const error = new Error(`KEY_ERROR: ${key}`)
      error.statusCode = 400
      throw error
    }
  })
  const result = await postingService.deletePost(id, title, contents)
  } catch (err) {
    console.log(err)
    res.status(err.statusCode).json({ message: err.message })
  }
  res.status(200).json({ message: "posting deleted" });
}


module.exports = {
  getList,
  createPost,
  updatePost,
  deletePost
}