var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const makeHash = async (password) => {
  return await bcrypt.hash(password, 10)
}
 
const main = async () => {
  const hashedPassword = await makeHash('mySimplePassword');
  console.log('hashedPassword: ', hashedPassword)
}

const token = jwt.sign({ id:2 }, 'server_made_secret_key', { expiresIn: '1h' })

async function main1() {
  console.log('token: ', token)
}

main()
main1()