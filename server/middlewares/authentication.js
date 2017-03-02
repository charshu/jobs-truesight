// @flow
const User = require('../models/User');

// How to store information to session
exports.serializeUser = function(user, done) {
  console.log("== SerializeUser to session ==");
  console.log(`session information is ${user._id}`)
  done(null, user._id);
}

// How to get req.user from session
exports.deserializeUser = async function(id, done) {
  console.log("== DeserializeUser from session ==");
  console.log(`session information is ${id}`)
  try {
    const user = await User.findById(id);
    done(null, user)
  } catch (e) {
    done(e);
  }

}

// How to authentication with email
exports.LocalStrategyHandler = async function(username, password, done) {
  console.log('=== start authtentication ===')
  try{
    const user = await User.findOne({email: username});
    if(!user) {
      done(null, false);
    } else if(user) {
      // check password here
      if(true) {
        console.log('password match...')
        done(null, user);
      } else {
        done(null, false);
      }
    }
  } catch (e) {
    done(e);
  }

}
