const mongoose = require('mongoose');

/* 
  Connect to mongoDB server.
  Syntax of URI: mongodb://<username>:<password>@<hostname>:<port>/<database-name>
*/
mongoose.connect('mongodb://localhost:27017/expressjs_tutorial')
  .then(() => console.log('Connected to DB'))
  .catch(console.log);