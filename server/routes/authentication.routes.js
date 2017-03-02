module.exports = function({ User }) {

  const passport = require('passport');
  const privateRouter = require('express').Router();
  const publicRouter = require('express').Router();

  publicRouter.post('/login', passport.authenticate('local'), (req, res) => {
      console.log("=== done login ===")
      res.json(req.user);
  });

  publicRouter.post('/register', async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.json({
        id: newUser._id,
      });
    } catch (e){
      console.log(e);
      res.status(500).end();
    }
  });

  privateRouter.use((req, res, next) => {
      // reject if no user
      if (!req.user) {
        res.send(401).end();
      } else {
        next()
      }
  });


  privateRouter.get('/info', async (req, res) => {
    console.log(req.user);
    res.json(req.user);
  });

  privateRouter.delete('/', async (req, res) => {
    try {
      await User.remove({_id: req.user._id});
      res.status(200).send('Removed').end();
    } catch(e) {
      res.status(500).send(e.toString());
    }
  })

  const router = require('express').Router();
  router.use(publicRouter);
  router.use(privateRouter);
  return router;
};
