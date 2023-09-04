const mongoose = require('mongoose');

/*
  New instance of a schema
*/
const UserSchema = new mongoose.Schema({
  password: {
    type: mongoose.SchemaTypes.String,
    required: true,
  },
  email: {
    type: mongoose.SchemaTypes.String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: mongoose.SchemaTypes.Date,
    required: true,
    default: new Date(),
  },
});

/*
  Compile our schema into a model.
*/
module.exports = mongoose.model('users', UserSchema);