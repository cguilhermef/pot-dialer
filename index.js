const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);

app.use(bodyParser.json());

app.use(express.static('assets'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/api/write', (req, res) => {
  const body = req.body;
  const { terminal, letter } = body;
  io.emit('write',{ terminal, letter});
  res.status(200).send();
});

app.post('/api/erase', (req, res) => {
  const body = req.body;
  const { terminal } = body;
  io.emit('erase', { terminal });
  res.status(200).send();
});

http.listen(3000, ()=> {
  console.log("soe running!");
});
