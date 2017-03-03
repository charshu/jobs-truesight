// @flow

// How to store information to session
exports.serializeUser = ({ User }) => (user, done) => {
  console.log('== SerializeUser to session ==');
  console.log(`session information is ${user._id}`);
  done(null, user._id);
};

// How to get req.user from session
exports.deserializeUser = ({ User }) => async (id, done) => {
  console.log('== DeserializeUser from session ==');
  console.log(`session information is ${id}`);
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
};

// How to authentication with email
exports.LocalStrategyHandler = ({ User }) => async (username, password, done) => {
  console.log('=== start authtentication ===');
  try {
    const user = await User.findOne({ email: username });
    if (!user) {
      done(null, false);
    } else if (user) {
      // check password here
      console.log('Compare user password');
      console.log('input password is ' + password);
      console.log('user password is ' + user.password);
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        console.log('password match...');
        done(null, user);
      } else {
        done(null, false);
      }
    }
  } catch (e) {
    done(e);
  }
};
