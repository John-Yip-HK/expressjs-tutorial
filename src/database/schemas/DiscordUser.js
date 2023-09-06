const mongoose = require('mongoose');

/*
  New instance of a schema
*/
const DiscordUserSchema = new mongoose.Schema({
  discordId: {
    type: mongoose.SchemaTypes.String,
    required: true,
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
module.exports = mongoose.model('discord_users', DiscordUserSchema);