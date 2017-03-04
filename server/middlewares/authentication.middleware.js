// @flow
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
require('dotenv').config();
// How to store information to session
exports.serializeUser = ({ Logger }) => (user, done) => {
  const console = Logger({ prefix: 'SerializeUser' });
  console.info(`session information is ${user._id}`);
  done(null, user._id);
};

// How to get req.user from session
exports.deserializeUser = ({ User, Logger }) => async (id, done) => {
  const console = Logger({ prefix: 'DeserializeUser' });
  console.info(`session information is ${id}`);
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
};

// How to authentication with email
exports.LocalStrategyMiddleware = ({ User, Logger }) => new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
  const console = Logger({ prefix: 'Email login' });
  try {
    const user = await User.findOne({ email: username });
    if (!user) {
      console.warn('user not found');
      done(null, false);
    } else if (user) {
      // check password here
      console.info('Compare user password...');
      console.log(`input password is ${password}`);
      console.log(`hash password is ${user.password}`);
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        console.success('password match');
        done(null, user);
      } else {
        console.error('wrong password');
        done(null, false);
      }
    }
  } catch (e) {
    done(e);
  }
});


// FB Auth
const facebookAuthConfig = {
  // Dont put clientID, clientSecret on repository
  // this is stupid idea
  // put it in .env and ignore it
  clientID: process.env.FACEBOOK_ID,
  clientSecret: process.env.FACEBOOK_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: [
    'name', 'email', 'location', 'gender', 'age_range',
  ],
  passReqToCallback: true,
};
exports.FacebookStrategyHandler = ({ User, Logger }) => new FacebookStrategy(facebookAuthConfig,
 async (req, accessToken, refreshToken, profile, done) => {
   const console = Logger({});
   console.log(`=== start Facebook authtentication ===${JSON.stringify(profile)}`);
   try {
    // check if there are duplicated facebook.id
     const existingUser = await User.findOne({ facebook: profile.id });
     const existingEmail = await User.findOne({ email: profile._json.email });
     if (existingUser) {
       console.log('=== existing user ===');
       done(null, existingUser);
     } else if (existingEmail) {
      // check if user email is the same as facebook email
       console.log('=== existing email ===');
       done(null, existingEmail);
     } else {
    // create new user
       console.log('=== save Facebook user ===');
       const user = new User();
       user.email = profile._json.email;
       user.facebook = profile.id;
       user.tokens.push({ kind: 'facebook', accessToken });
       user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
       user.profile.gender = profile._json.gender;
       user.profile.age_range = profile._json.age_range ? profile._json.age_range.min : '';
       user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
       user.profile.location = (profile._json.location) ? profile._json.location.name : '';
       await user.save();
       done(null, user);
     }
   } catch (e) {
     done(e);
   }
 });
