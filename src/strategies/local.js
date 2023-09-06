const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');

const User = require('../database/schemas/User');
const { comparePassword } = require("../utils/helpers");

passport.serializeUser((user, done) => {
  console.log('Serializing user...');
  done(null, user.id);
});

/*
  The first argument of the callback will be the thing passed into `done` function of `serializeUser()`.
  Will be called for every request requiring authentication.
*/
passport.deserializeUser(async (id, done) => {
  console.log('Deserializing user...');
  console.log(id);

  try {
    const user = await User.findById(id);

    if (!user) throw new Error('User not found');
    
    // The value of `user` is attached to the `req.user` property.
    done(null, user);
  } catch (err) {
    console.log(err);
    done(err, null);
  }
});

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