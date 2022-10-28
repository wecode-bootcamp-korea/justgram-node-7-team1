const express = require("express");
const cors = require("cors");
const router = require("./routers");
let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(router);

  return app;
};

module.exports = { createApp };
