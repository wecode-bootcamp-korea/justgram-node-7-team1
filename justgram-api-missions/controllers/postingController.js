const postingService = require('../services/postingService')

const getPosting = async(req, res) => {
	try {
		console.log('CONTROLLER 잘 오나?')
		const posting = await postingService.getPosting()
		console.log('data in controller: ', posting)

		res.status(200).json({message: 'SUCCESS', data: posting})
	} catch (err) {
		console.log(err)
		res.status(err.satusCode).json({message: err.message})
	}
}

module.exports = {
	getPosting
}