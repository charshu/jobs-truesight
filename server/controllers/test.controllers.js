const async = require('async');

module.exports = () => {
  const createTestSheet = async (req, res) => {
    const console = req.context.Logger({ prefix: 'test/save controller' });
    try {
      const newTestSheet = new req.context.Test({
        uid: req.body.uid,
        title: req.body.title
      });
      await newTestSheet.save();

      async.each(req.body.questions, (question, next) => {
        const temp = new req.context.Question({
          testId: newTest.id,
          title: question.title,
          factor: question.factor,
          choices: question.choices
        });
        temp.save((err, doc) => {
          next();
        });
      }, () => {
        console.log('all questions are saved!');
      });

      console.log('=== successfully save new test===');
      res.json({
        id: newTest.id
      });
    } catch (e) {
      console.log(e);
      res.status(500).end();
    }
  };

  const createAnswerSheet = async (req, res) => {
    const console = req.context.Logger({ prefix: 'answer/create controller' });
    try {
      const newAnswerSheet = 
    }catch (err) {

    }
  };

  return {
    createTestSheet,
    createAnswerSheet
  };
};
