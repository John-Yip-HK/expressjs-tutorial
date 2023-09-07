const User = require('../database/schemas/User');
const { hashPassword } = require("../utils/helpers");

/*
  Extract this function out for unit testing.

  We need to mock both `req` and `res` in unit testing.
*/
async function authRegisterController(req, res) {
  const { email } = req.body;

  /*
    Create a new user if the user has not been found in the user model based on the `email`.

    We need to mock the `User` model in our unit testing.
  */
  const userDB = await User.findOne({
    email
  });

  if (userDB) {
    res.status(400);
    res.send({ msg: 'User already exists.' });
  } else {
    const password = hashPassword(req.body.password);
    console.log(password);
    await User.create({
      password, email
    });
    res.sendStatus(201);
  }
}

module.exports = {
  authRegisterController
};