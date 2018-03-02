const express = require('express');
const http = require('http');
const app = express();

var i = 0;

app.get('/', (req, res) => {
  res.end(`Hello World les gents, vous êtes la: ${++i} personne à avoir visité notre API.\nNode Version: ${process.versions.node}`);
});

app.get('/jsonTest', (req, res) => {
  res.json({result: i});
});

const PORT = process.env.PORT || 3000;
http.Server(app).listen(PORT, '0.0.0.0', () => {
  console.log("HTTP server listening on port %s", PORT);
});