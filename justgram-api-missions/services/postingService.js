const postingDao = require('../models/postingDao')

const getPosting = async() => {
	console.log('서비스까지 잘 오나?')
	const posting = await postingDao.getPosting()
	console.log('data in service: ', posting)
	return posting
}

module.exports = {
	getPosting
}