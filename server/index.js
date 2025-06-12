const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();

let hostId = null; 

let players = new Array()
let GAME_STATE = "WAITING" //'waiting', 'writing', 'drawing', 'finished'
const nicknames = [
  'Zorpax', 'Nuklodon', 'XxC4rbonxX', 'BlipZonk', 'Kraxxor',
  'V1rusTTV', 'Lun4tik', '0xDeadMeat', 'Snorblo', 'YeloToes',
  'W33dDuck', 'Flipzard', 'B1tzkrieg', 'Krumpz', 'HexaTuna',
  'Ch0koBlast', 'DripKing69', 'PwnSauce', 'SkibidiZap', 'Voidling'
];

function getRandomNick() {
  if (players.length >= nicknames.length) {
    throw new Error('Todos os nicks já foram usados.');
  }

  const index = Math.floor(Math.random() * nicknames.length);
  const selected = nicknames[index];

  return players.some(p => p.nick === selected)
    ? getRandomNick()
    : selected;
}

app.use(cors({
  origin: 'http://localhost:5173', // frontend
  methods: ['GET', 'POST']
}));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // frontend
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {

  socket.on('join', (uuid) => {
    if(!hostId) hostId = socket.id

    players.push({
      id: socket.id,
      nick: getRandomNick(),
      isHost: socket.id == hostId,
      uuid
    });

    io.emit('updated-players', players)
  })

  socket.on('change-nick', (nick) => {
    if(!!nick && nick.length > 0){
      players = players.map(player => {
        if(player.id == socket.id){
          player.nick = nick
          console.log(player.nick)
        }
        return player
      })
      io.emit('updated-players', players)
    }
  })

  socket.on('message', (message) => {
    console.log(hostId)
    console.log('Message received:', message);
    io.emit('message', message); // Broadcast para todos
  });

  socket.on('disconnect', () => {
    //remove player
    const index = players.findIndex(p => p.id === socket.id);
    if (index !== -1) players.splice(index, 1);

    //se o host sair seta outro como host
    if(socket.id == hostId && players.length > 0){
      hostId = players[0].id
      players[0].isHost = true;
    }else if(socket.id == hostId){
      hostId = null
    }

    io.emit('updated-players', players)
  });
});

server.listen(4000, () => {
  console.log('Server is running on http://localhost:4000');
});
