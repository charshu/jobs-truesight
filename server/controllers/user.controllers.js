
module.exports = function ({ User }) {
  const login = (req, res) => {
    console.log('=== done login ===');
    res.json(req.user);
  };

  const register = async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.json({
        id: newUser._id,
      });
    } catch (e) {
      res.status(500).end();
    }
  };

  const info = async (req, res) => {
    res.json(req.user);
  };

  const remove = async (req, res) => {
    try {
      await User.remove({ _id: req.user._id });
      res.status(200)
      .send('Removed')
      .end();
    } catch (e) {
      res.status(500).send(e.toString());
    }
  };

  return {
    login,
    register,
    info,
    remove,
  };
};
