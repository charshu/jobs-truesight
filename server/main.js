// TODO: setup express and routes
// and add dependency

const express = require('express');
const IS_DEV = process.env.NODE_ENV !== 'production';
if(IS_DEV) {
  // setup dev here
}



// setup express
const app = express();
app.use(require('./routes'));


app.listen(3000, function(){
  console.log('Remote server start on 3000');
});
