const express = require('express');
const http = require('http');
const io = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const socket = io(server, {
  cors: {
    origin: '*',
  },
});

const PORT = 8080;

app.use(bodyParser.json());

app.post('/receive', (req, res) => {
  const message = req.body.message;

  socket.emit('message', message);

  res.sendStatus(200);
});

socket.on('connection', (client) => {
  console.log('Client connected to Node A');

  client.on('message', (msg) => {
    const data = JSON.stringify({ message: msg });

    const options = {
      hostname: 'localhost',
      port: 8081,
      path: '/receive',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-length': data.length,
      },
    };

    const req = http.request(options);
    req.write(data);
    req.end();
  });
});

server.listen(PORT, () => {
  console.log(`Node A listening on ${PORT}`);
});
