// const http = require("http");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
// const app = require("./app");
// // const server = http.createServer(app);

// try {
//   app.listen(8000, () => {
//     console.log("server is listening on PORT 8000");
//   });
// } catch (err) {
//   console.log(err);
//   res.json({ message: err.message });
// }
const createApp = require("./app");

const startServer = async () => {
  const app = createApp();

  app.listen(8000, () => {
    console.log(`server is listening on PORT 8000`);
  });
};
startServer();
// -------------------------------------------------------------------------------------------------
