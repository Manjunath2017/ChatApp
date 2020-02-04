const app = require('express')();
const port = process.env.PORT || 3000

app.get('/', (request, response)=>{
    response.send('Hello!!!');
});

app.listen(port,() => {
  console.log(`Server running at port `+port);
});
