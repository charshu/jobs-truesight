
module.exports = () => {
  const login = (req, res) => {
    const console = req.context.Logger({ prefix: 'user/login controller' });
    console.log('=== done login ===');
    // passport local setup req.user while authentication process
    if (req.user) {
      res.status(200)
    .send('Success')
    .end();
    } else {
      res.status(401)
    .send('Unauthorized1')
    .end();
    }
  };

  const register = async (req, res) => {
    const console = req.context.Logger({ prefix: 'user/register controller' });
    try {
      const newUser = new req.context.User({
        email: req.body.email,
        password: req.body.password,
        profile: {
          gender: req.body.gender,
          jobId: req.body.jobId,
          workPlaceId: req.body.workPlaceId
        }
      });
      console.log('=== save new user ===');
      await newUser.save();
      res.json({
        id: newUser._id
      });
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  };

  const info = async (req, res) => {
    const console = req.context.Logger({ prefix: 'user/info controller' });
    console.log('=== response info ===');
    res.json(req.user);
  };

  const remove = async (req, res) => {
    const console = req.context.Logger({ prefix: 'user/remove controller' });
    try {
      console.log('=== remove user ===');
      await req.context.User.remove({ _id: req.user._id });
      res.status(200)
      .send('Removed')
      .end();
    } catch (e) {
      res.status(500).send(e.toString());
    }
  };
  const logout = async (req, res) => {
    const console = req.context.Logger({ prefix: 'user/logout controller' });
    console.log('=== done logout ===');
    req.logout();
    res.status(200)
      .send('Logout')
      .end();
  };

  return {
    login,
    register,
    info,
    remove,
    logout
  };
};
