
module.exports = () => {
  const login = (req, res) => {
    const console = req.context.Logger({ prefix: 'user/login controller' });
    console.log('=== done login ===');
    // passport local setup req.user while authentication process

    res.status(200)
    .send('Login')
    .end();
  };

  const register = async (req, res) => {
    const console = req.context.Logger({ prefix: 'user/register controller' });
    try {
      const newUser = new req.context.User({
        email: req.body.email,
        password: req.body.password
      });
      console.log('=== save new user ===');
      await newUser.save();
      res.json({
        id: newUser._id
      });
    } catch (e) {
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
