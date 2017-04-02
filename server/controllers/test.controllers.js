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

  const submitAnswerSheet = async (req, res) => {
    const console = req.context.Logger({ prefix: 'answer/submit controller' });
    try {
      console.log(`${req.user._id} ${req.body.answerSheet.userId}`);
      if (!req.user._id.equals(req.body.answerSheet.userId)) {
        res.status(401).end();
      } else {
        const newAnswerSheet = new req.context.AnswerSheet(req.body.answerSheet);
        await newAnswerSheet.save();
      // TODO: update answer sheet id on job and workplace

        await req.context.Job.findOneAndUpdate(
        { id: req.body.answerSheet.jobId },
          {
            $push: {
              answers: newAnswerSheet.id
            }
          });

        const workPlace = await req.context.WorkPlace.findOne({
          placeId: req.body.answerSheet.workPlaceId
        });
        if (!workPlace) {
          const newWorkPlace = new req.context.WorkPlace({
            placeId: req.body.answerSheet.workPlaceId
          });
          await newWorkPlace.save();
        }
        await req.context.WorkPlace.findOneAndUpdate(
        { placeId: req.body.answerSheet.workPlaceId },
          {
            $push: {
              answers: newAnswerSheet.id
            }
          });
        res.json(newAnswerSheet);
      }
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  };

  const createJob = async (req, res) => {
    const console = req.context.Logger({ prefix: 'job/create controller' });
    try {
      console.log(req.body.jobs);
      async.each(req.body.jobs, (job, next) => {
        const newJob = new req.context.Job({
          name: job
        });
        newJob.save((err, doc) => {
          next();
        });
      }, () => {
        console.log('all jobs are saved!');
      });
      const jobs = await req.context.Job.find({});
      res.json(jobs);
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  };


  return {
    createTestSheet,
    submitAnswerSheet,
    createJob
  };
};
