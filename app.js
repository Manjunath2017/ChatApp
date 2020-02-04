const app = require('express')();
const http=require('http');
const server=http.createServer(app);

const moment=require('moment');
const fs=require('fs');
const ws=fs.createWriteStream('./file.txt', {flags : "a"});


const socket=require('socket.io');
const io=socket(server);
app.get('/', (request, response)=>{
  response.sendFile(__dirname + '/public/index.html');
});

var storeUserName=[];
io.on('connection', (socket)=>{
  console.log('socket connected!');
  io.emit('object', {name:"Manjunath"}); 

  //new user
  socket.on('new user', (newName, callBack)=>{
      if(storeUserName.indexOf(newName) != -1) //if true return -1, name exist
          return callBack(false);

      callBack(true);
      // create current user 
      socket.currentUsername=newName; //create socket variable
      // console.log(socket.currentUsername);
      storeUserName.push(socket.currentUsername);
      // storeUserName.push(newName);
      updateUsername(newName);
  });
  socket.on('typing', ()=>{
      io.emit('typing', socket.currentUsername);
  })
  
  
  var updateUsername=(data)=>{
      //send user names
      io.emit('userNames', storeUserName);   
  }
  const currentDate=moment().format('llll'); //Thu, Jan 30, 2020 1:08 AM 
  console.log(currentDate);

  socket.on('send message', (data)=>{
      console.log(data, '38 line');
      ws.write(`${socket.currentUsername +': ' +data +' '+currentDate } \n`);
      
      io.emit('new message', {msg:data, date: currentDate, user:socket.currentUsername});
  });

  socket.on('disconnect', (data)=>{
      if(!socket.currentUsername)
          return;
      //remove currentUsername
      storeUserName.splice(storeUserName.indexOf(socket.currentUsername), 1);
      updateUsername();
  })
});


const port = process.env.PORT || 3000
server.listen(port,() => {
  console.log(`Server running at port `+port);
});
