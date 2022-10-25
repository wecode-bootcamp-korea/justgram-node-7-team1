const dotenv = require("dotenv");
dotenv.config();

const PORT = 8000
const http = require('http');
const app = require('./app');
const server = http.createServer(app);

const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is listening on PORT ${PORT}`);
    })
  } catch (err) {
    console.log(err);
  }
}

startServer();
