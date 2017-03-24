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
        userId: req.body.userId,
        jobId: req.body.jobId,
        workPlaceId: req.body.workPlaceId,
        answers: []
      });
      await newAnswerSheet.save();
      res.json({
        id: newAnswerSheet.id
      });
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
