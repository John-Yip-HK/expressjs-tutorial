const bcrypt = require('bcrypt');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();

  return bcrypt.hashSync(password, salt);
}

function comparePassword(rawPassword, hashedPassword) {
  return bcrypt.compareSync(rawPassword, hashedPassword);
}

module.exports = { hashPassword, comparePassword };