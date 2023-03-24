const { Socket } = require('dgram');
const express= require('express');
const app = express();
const http = require('http');
const path = require('path');
const server= http.createServer(app);
const port = process.env.PORT || 3000;
const { Server } = require('socket.io');
const io = new Server(server);
const rooms = [];
app.use(express.static(path.join(__dirname , 'client')))
app.get('/healthcheck',(req,res) => {
  res.send("<h1>RPS App Running....</h1>");
});



io.on('connection',(socket) => {
  console.log("A user connected");
  socket.on('disconnect',() => {
     console.log('User disconnected');
  })

  socket.on('createGame',() => {
    const roomUniqueId = makeid(6);
    rooms[roomUniqueId] ={};
    socket.join(roomUniqueId);
    socket.emit('newGame', {roomUniqueId: roomUniqueId});
  });
   


  function makeid(length) {
    var result = '';
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charlen = characters.length;   
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charlen));
        
    }

    return result;
}
  socket.on('joinGame',(data) => {
    if (rooms[data.roomUniqueId] != null) {

      socket.join(data.roomUniqueId);
       socket.to(data.roomUniqueId).emit('PlayersConnected',{});
       socket.emit('PlayersConnected');
    }
  });

  socket.on('p1Choice',(data) => {
    let rpsValue = data.rpsvalue;
    rooms[data.roomUniqueId].p1Choice = rpsValue;
    socket.to(data.roomUniqueId).emit("p1choice", {rpsValue: data.rpsValue});
    if (rooms[data.roomUniqueId].p2Choice != null) {
        declareWinner(data.roomUniqueId);
    }
  })
  socket.on('p2Choice',(data) => {
    let rpsValue = data.rpsvalue;
    rooms[data.roomUniqueId].p2Choice = rpsValue;

    socket.to(data.roomUniqueId).emit("p2choice", {rpsValue: data.rpsValue});
    if (rooms[data.roomUniqueId].p1Choice != null) {
        declareWinner(data.roomUniqueId);
    }
  })

  var p1score = 0;
  var p2score =0;

  function declareWinner(roomUniqueId) {
    console.log("Function chal raga hai");

    let p1Choice  =rooms[roomUniqueId].p1Choice;
    let p2Choice  =rooms[roomUniqueId].p2Choice;
    let winner = null;

     
   
    if (p1Choice == p2Choice) {
      winner == 'd';
    }else if(p1Choice == 'Paper'){
      if (p2Choice == 'Rock') {
        winner = 'p1';
        p1score = p1score + 1;
  
      }else{
        winner = 'p2';
        p2score = p2score + 1;
      }
    }else if(p1Choice == 'Rock'){
      if (p2Choice == 'Paper') {
        winner = 'p2';
        p2score = p2score + 1;
      }else{
        winner = 'p1';
        p1score += 1;
      }
      }else if(p1Choice =='Scissor'){
        if (p2Choice == 'Rock') {
          winner = 'p2';
          p2score = p2score + 1;
        }else{
          winner = 'p1';
          p1score = p1score + 1;
        }
      }
      io.sockets.to(roomUniqueId).emit('win',{
        winner: winner,
        p1score: p1score,
        p2score: p2score,
        p1Choice:p1Choice,
        p2Choice: rooms[roomUniqueId].p2Choice}) 
        
        p1Choice = '';
        p2Choice= '';

        winner = null;
        rooms[roomUniqueId].p1Choice = '';
        rooms[roomUniqueId].p2Choice = '';

  }
  
})


app.get('/',(req,res) => {
  res.sendFile(__dirname + '/client/index.html' );
});
server.listen(port,() => {
  console.log(`Server listening on port ${port}`);
})