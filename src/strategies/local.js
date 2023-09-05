const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../database/schemas/User');
const { comparePassword } = require("../utils/helpers");

passport.use(
  new LocalStrategy({
    // Set name of user field in request body. Default is `username`.
    usernameField: 'email',
  }, async (email, password, done) => {
    // Verify function
    console.log(email, password);
    
    try {
      if (!email || !password) {
        // Throw error to indicate authentication failed.
        // done(new Error('Bad request. Missing credentials'), null);
        throw new Error('Missing credentials');
      }

      const userDB = await User.findOne({ email });
      if (!userDB) {
        throw new Error('User not found');
      }
  
      const isValid = comparePassword(password, userDB.password);
      if (isValid) {
        console.log('Authenticate successfully!');

        // We need to attach the user to session and request object.
        done(null, userDB)
      } else {
        console.log('Invalid authentication');
        done(null, null);
      }
    } catch (err) {
      console.log(err);
      
      done(err, null);
    }
  })
)