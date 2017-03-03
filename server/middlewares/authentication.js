// @flow
const chalk = require('chalk');
// How to store information to session
exports.serializeUser = ({ User }) => (user, done) => {
  console.log(chalk.yellow('== SerializeUser to session =='));
  console.log(chalk.yellow(`session information is ${user._id}`));
  done(null, user._id);
};

// How to get req.user from session
exports.deserializeUser = ({ User }) => async (id, done) => {
  console.log(chalk.yellow('== DeserializeUser from session =='));
  console.log(chalk.yellow(`session information is ${id}`));
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
};

// How to authentication with email
exports.LocalStrategyHandler = ({ User }) => async (username, password, done) => {
  console.log('=== start local authtentication ===');
  try {
    const user = await User.findOne({ email: username });
    if (!user) {
      console.log('user not found');
      done(null, false);
    } else if (user) {
      // check password here
      console.log('Compare user password...');
      console.log('input password is ' + password);
      console.log('hash password is ' + user.password);
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        console.log('password match',chalk.green('✓'));
        done(null, user);
      } else {
        console.log('wrong password',chalk.red('x'));
        done(null, false);
      }
    }
  } catch (e) {
    done(e);
  }
};

exports.FacebookStrategyHandler = ({User}) => async (req, accessToken, refreshToken, profile, done) => {
  console.log('=== start Facebook authtentication ==='+JSON.stringify(profile));
  try{
   
    //check if there are duplicated facebook.id 
    const existingUser =  await User.findOne({facebook: profile.id})
    const existingEmail = await User.findOne({email: profile._json.email});
    if(existingUser){
      console.log('=== existing user ===');
      done(null,existingUser);
    }
    //check if user email is the same as facebook email
    else if(existingEmail){
      console.log('=== existing email ===');
      done(null,existingEmail);
    }
    else{
    //create new user
        console.log('=== save Facebook user ===');
        const user = new User();
        user.email = profile._json.email;
        user.facebook = profile.id;
        user.tokens.push({kind: 'facebook', accessToken});
        user.profile.name = `${profile.name.givenName} ${profile.name.familyName}`;
        user.profile.gender = profile._json.gender;
        user.profile.age_range = profile._json.age_range?profile._json.age_range.min:'';
        user.profile.picture = `https://graph.facebook.com/${profile.id}/picture?type=large`;
        user.profile.location = (profile._json.location)? profile._json.location.name: '';
        await user.save();
        done(null,user);
    }
      
    
    
  }catch(e){
    done(e);
  }
}
