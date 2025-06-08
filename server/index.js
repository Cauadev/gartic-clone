const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

// 🔓 Libera CORS para o frontend
app.use(cors({
  origin: 'http://localhost:5173', // frontend
  methods: ['GET', 'POST']
}));

const server = http.createServer(app);

// ✅ Libera CORS para o Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // frontend
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    console.log('Message received:', message);
    io.emit('message', message); // Broadcast para todos
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
