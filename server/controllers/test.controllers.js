const async = require('async');

module.exports = () => {
  const createTestSheet = async (req, res) => {
    const console = req.context.Logger({ prefix: 'test/save controller' });
    try {
      const newTestSheet = new req.context.TestSheet({
        uid: req.body.uid,
        title: req.body.title
      });
      await newTestSheet.save();

      async.each(req.body.questions, (question, next) => {
        const temp = new req.context.Question({
          testId: newTestSheet.id,
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
        id: newTestSheet.id
      });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  };

  const createAnswerSheet = async (req, res) => {
    const console = req.context.Logger({ prefix: 'answer/create controller' });
    try {
      const newAnswerSheet = new req.context.AnswerSheet({
        testSheetUid: req.body.testSheetUid,
        userId: req.user._id,
        jobId: req.user.profile.jobId,
        workPlaceId: req.user.profile.workPlaceId,
        done: false,
        answers: []
      });
      await newAnswerSheet.save();
      res.json(newAnswerSheet);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  };

  return {
    createTestSheet,
    createAnswerSheet
  };
};
