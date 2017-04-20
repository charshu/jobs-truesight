
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
      console.log(req.body)
      const newUser = new req.context.User({
        email: req.body.email,
        password: req.body.password,
        profile: {
          name: req.body.profile.name,
          gender: req.body.profile.gender,
          location: req.body.profile.location,
          age_range: req.body.profile.age_range,
          jobId: req.body.profile.jobId,
          workPlaceId: req.body.profile.workPlaceId,
          salary: req.body.profile.salary
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

  const updateProfile = async (req, res) => {
    const console = req.context.Logger({ prefix: 'user/updateProfile controller' });
    try {
      if (!req.user) {
        throw new Error('You have no authorized');
      }
      const user = await req.context.User.findOne({ _id: req.user._id });
      if (user) {
        if (req.body.name)user.profile.name = req.body.name;
        if (req.body.gender)user.profile.gender = req.body.gender;
        if (req.body.age_range)user.profile.age_range = req.body.age_range;
        if (req.body.location)user.profile.location = req.body.location;
        if (req.body.jobId)user.profile.jobId = req.body.jobId;
        if (req.body.workPlaceId)user.profile.workPlaceId = req.body.workPlaceId;
        if (req.body.salary)user.profile.salary = req.body.salary;
        await user.save();
        console.log('successfully update user');
        res.status(200).send('Success')
        .end();
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e.toString());
    }
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
    updateProfile,
    remove,
    logout
  };
};
