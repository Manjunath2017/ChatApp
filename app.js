const app = require('express')();
const http=require('http');
const server=http.createServer(app);

const socket=require('socket.io');
const io=socket(server);
app.get('/', (request, response)=>{
  response.sendFile(__dirname + '/public/index.html');
});

io.on('connection', (socket)=>{
  console.log('socket connected!');

  io.emit('object', {name:"Manjunath"}); 
});


const port = process.env.PORT || 3000
server.listen(port,() => {
  console.log(`Server running at port `+port);
});
