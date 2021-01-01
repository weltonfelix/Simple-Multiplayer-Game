import express from 'express';
import http from 'http';

import { Server } from 'socket.io';

import createGame from './public/game.js'

const app = express();
const server = http.createServer(app);

const socket = new Server(server);

app.use(express.static('public'));

const game = createGame();
game.start();

game.subscribe((command) => {
  console.log(`Emitting: ${command.type}`);
  socket.emit(command.type, command);
});

socket.on('connection', (socket) => {
  const playerId = socket.id;
  console.log(`Player connected on Server with id: ${playerId}`);
  
  game.addPlayer({ playerId });

  socket.emit('setup', game.state);  
  
  socket.on('disconnect', () => {
    game.removePlayer({ playerId });
    console.log(`Player disconnected: ${playerId}`);
  });

  socket.on('movePlayer', (command) =>{
    command.playerId = playerId;
    command.type = 'movePlayer';

    game.movePlayer(command);
  });
});

server.listen(3000, () => {
  console.log('Server listening on port: 3000')
});
