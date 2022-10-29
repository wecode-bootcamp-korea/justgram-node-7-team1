const  express = require('express');
const  dotenv = require('dotenv');
dotenv.config();
const  morgan = require('morgan');
const  router  = require("./routers");
const  cors = require('cors');

const createApp = () => {
  const app = express();
  var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
  }
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(morgan('combined'));
  app.use(router);

  return app;
};

module.exports = {createApp};