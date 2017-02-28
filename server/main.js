// TODO: setup express and routes
// and add dependency

const express = require('express');
const app = express();


const IS_DEV = process.env.NODE_ENV !== 'production';

app.get('/api/handshake', function(req, res) {
  res.send('ok');
});

if(IS_DEV) {
  // setup dev here
}

app.listen(3000, function(){
  console.log('Remote server start on 3000');
});
