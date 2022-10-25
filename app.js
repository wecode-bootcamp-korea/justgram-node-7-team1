const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const morgan = require('morgan');
const methodOverride = require('method-override');

const app = express();

app.use(express.json());
app.use(routes);
app.use(cors());
app.use(morgan('combined'));
app.use(methodOverride());

app.use((err, req, res, next) => {
  const { status, message } = err
  console.error(err);
  res.status(status || 500).json({ message });
})

module.exports = app













