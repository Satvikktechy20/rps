console.log('This is a Rock paper Scissor Game');

var socket = io();
let roomUniqueId = null;
let player1 = false;



function createGame() {
  socket.emit('createGame');
  player1 = true;
}

function joinGame() {
  roomUniqueId = document.getElementById('roomUniqueId').value;
  socket.emit('joinGame', {roomUniqueId: roomUniqueId});
}

socket.on('newGame',(data) => {
roomUniqueId = data.roomUniqueId;
document.getElementById('initial').style.display = "none";
document.getElementById('gamePlay').style.display = "block";
let copybtn = document.createElement('button'); 
copybtn.style.display = "block";
copybtn.innerText = "Copy Code";

copybtn.addEventListener('click' ,() =>{
  navigator.clipboard.writeText(roomUniqueId);
})
document.getElementById('waitingArea').innerHTML = `Waiting for Opponent, Please share ${roomUniqueId} to Join.`;
document.getElementById('waitingArea').appendChild(copybtn);
})


socket.on('PlayersConnected', () => {
document.getElementById('initial').style.display = "none"; 
  document.getElementById('waitingArea').style.display = "none";
  document.getElementById('gameArea').style.display = "block";
})

socket.on('p1choice', (data) => {
if (!player1) {
 createOpponentChoiceBtn(data);
}
})

socket.on('p2choice', (data) => {
if (player1) {
  createOpponentChoiceBtn(data);
}
})

function sendChoice(rpschoice) {
const choiceEvent = player1? "p1Choice" : "p2Choice";
socket.emit(choiceEvent,{
  rpsvalue: rpschoice,
  roomUniqueId:roomUniqueId
})

let pchbtn = document.createElement('button');
pchbtn.style.display = 'block';
pchbtn.innerHTML = rpschoice;
document.getElementById('player1Choice').innerHTML = '';
document.getElementById('player1Choice').appendChild(pchbtn);
}

function createOpponentChoiceBtn(value) {
document.getElementById("opponentChoice").innerHTML = 'Opponent made a choice.';
let opponentbtn = document.createElement('button');
opponentbtn.id = 'opponentbtn';
opponentbtn.style.display = 'none';
opponentbtn.innerText = value.rpsvalue;

document.getElementById('player2Choice').appendChild(opponentbtn);
}


socket.on('win',(data)=> {
  console.log("A winner found");
  if (data.winner == 'p1') {
    if(data.p1score !=5){
      if(player1) {
        document.getElementById("opponentChoice").innerHTML = 'Congo! You won. The opponent chose '+ data.p2Choice+ ' You have ' + data.p1score+ ' points';
      }else if(!player1){
        document.getElementById("opponentChoice").innerHTML = 'Sorry! You lost. The opponent chose '+ data.p1Choice +' You have ' + data.p2score+ ' points';
     }
    setTimeout(() => {
      document.getElementById("opponentChoice").innerHTML = 'Waiting for opponent.';
      let buttonrock = document.createElement('button');
      buttonrock.setAttribute('onclick',"sendChoice('Rock')");
      buttonrock.innerHTML = 'Rock';
      let btnpaper = document.createElement('button');
      btnpaper.innerHTML = 'Paper';
      btnpaper.setAttribute('onclick',"sendChoice('Paper')");
      let btnscissor = document.createElement('button');
      btnscissor.innerHTML = 'Scissor'
      btnscissor.setAttribute('onclick',"sendChoice('Scissor')");
      document.getElementById('player1Choice').innerHTML = '';
      document.getElementById('player1Choice').appendChild(buttonrock);
      document.getElementById('player1Choice').appendChild(btnpaper);
      document.getElementById('player1Choice').appendChild(btnscissor);
      data.p1Choice = '';
      data.p2Choice ='';
    },4000)
    }
    else if(data.p1score ==5){
      if(player1) {
        document.getElementById("opponentChoice").innerHTML = 'Yay! you won the match';
      }else if(!player1){
        document.getElementById("opponentChoice").innerHTML = 'Sorry! You lost the match';
     }
     setTimeout(() => {
           location.reload();
     },4000);
    }
  }else if(winner == 'd'){
    document.getElementById("opponentChoice").innerHTML = 'Its a draw';
    setTimeout(() => {
      document.getElementById("opponentChoice").innerHTML = 'Waiting for opponent.';
      let buttonrock = document.createElement('button');
      buttonrock.setAttribute('onclick',"sendChoice('Rock')");
      buttonrock.innerHTML = 'Rock';
      let btnpaper = document.createElement('button');
      btnpaper.innerHTML = 'Paper';
      btnpaper.setAttribute('onclick',"sendChoice('Paper')");
      let btnscissor = document.createElement('button');
      btnscissor.innerHTML = 'Scissor'
      btnscissor.setAttribute('onclick',"sendChoice('Scissor')");
      document.getElementById('player1Choice').innerHTML = '';
      document.getElementById('player1Choice').appendChild(buttonrock);
      document.getElementById('player1Choice').appendChild(btnpaper);
      document.getElementById('player1Choice').appendChild(btnscissor);
      data.p1Choice = '';
      data.p2Choice ='';
    },4000)
  }else if (data.winner == 'p2') {
    if(data.p2score !=5){
      if(!player1) {
        document.getElementById("opponentChoice").innerHTML = 'Congo! You won. The opponent chose '+ data.p2Choice+ ' You have ' + data.p1score+ ' points';
      }else if(player1){
        document.getElementById("opponentChoice").innerHTML = 'Sorry! You lost. The opponent chose '+ data.p1Choice +' You have ' + data.p2score+ ' points';
     }
    setTimeout(() => {
      document.getElementById("opponentChoice").innerHTML = 'Waiting for opponent.';
      let buttonrock = document.createElement('button');
      buttonrock.setAttribute('onclick',"sendChoice('Rock')");
      buttonrock.innerHTML = 'Rock';
      let btnpaper = document.createElement('button');
      btnpaper.innerHTML = 'Paper';
      btnpaper.setAttribute('onclick',"sendChoice('Paper')");
      let btnscissor = document.createElement('button');
      btnscissor.innerHTML = 'Scissor'
      btnscissor.setAttribute('onclick',"sendChoice('Scissor')");
      document.getElementById('player1Choice').innerHTML = '';
      document.getElementById('player1Choice').appendChild(buttonrock);
      document.getElementById('player1Choice').appendChild(btnpaper);
      document.getElementById('player1Choice').appendChild(btnscissor);
      data.p1Choice = '';
      data.p2Choice ='';
    },4000)
    }
    else if(data.p2score ==5){
      if(!player1) {
        document.getElementById("opponentChoice").innerHTML = 'Yay! you won the match';
      }else if(player1){
        document.getElementById("opponentChoice").innerHTML = 'Sorry! You lost the match';
     }
     setTimeout(() => {
           location.reload();
     },4000);
    }
  }
})
