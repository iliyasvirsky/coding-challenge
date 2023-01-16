const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get('/api/getusers', async (req, res) => {
  const data = await fetch('https://randomuser.me/api/?results=10')
  .then(response => response.json())
  .then((data) => data);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(data.results));
});


app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);
