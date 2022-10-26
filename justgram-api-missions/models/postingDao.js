const { DataSource } = require('typeorm');

const myDataSource = new DataSource({
  type: process.env.TYPEORM_CONNECTION,
  host: process.env.TYPEORM_HOST,
  port: process.env.TYPEORM_PORT,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE
})

myDataSource.initialize()
 .then(() => {
    console.log("Data Source has been initialized!")
 })

const getPosting = async () => {
	console.log('dao까지 잘 오나?')
    const postings = await myDataSource.query(`
			SELECT 
				users.id, 
				users.name,
				users.email, 
					JSON_ARRAYAGG(
						JSON_OBJECT(
							'postingId', posts.id, 
							'postingTitle', posts.title, 
							'postingContent', posts.content
						)
					) as postings
			FROM justgram_7.users
			JOIN posts ON posts.user_id = users.id
			GROUP BY users.id;
  	`)

	console.log('data in dao: ', postings)
	return postings 
}

module.exports = {
	getPosting
}