const async = require('async');
const _ = require('lodash');

module.exports = () => {
  const createTestSheet = async (req, res) => {
    const console = req.context.Logger({
      prefix: 'test/save controller'
    });
    try {
      const newTestSheet = new req.context.TestSheet({
        uid: req.body.uid,
        title: req.body.title,
        questions: req.body.questions
      });
      await newTestSheet.save();

      // async.each(req.body.questions, (question, next) => {
      //   const temp = new req.context.Question({
      //     testId: newTestSheet.id,
      //     title: question.title,
      //     factor: question.factor,
      //     choices: question.choices
      //   });
      //   temp.save((err, doc) => {
      //     next();
      //   });
      // }, () => {
      //   console.log('all questions are saved!');
      // });

      console.log('=== successfully save new test===');
      res.json({
        id: newTestSheet.id
      });
    } catch (err) {
      console.log(err);
      res.status(500).end();
    }
  };
  const processResult = (result, answerSheet, testSheet, req) => {
    for (let i = 0; i < answerSheet.answers.length; i += 1) {
      const answer = answerSheet.answers[i];
      const question = _.find(testSheet.questions, {
        id: answer.questionId
      });
      if (!question) {
        throw new Error(`question id:"${answer.questionId}" not found in test sheet uid:"${testSheet.uid}"`);
      }
      const chosenChoice = _.find(question.choices, {
        id: answer.selectedChoiceId
      });
      if (!chosenChoice) {
        throw new Error(`choice id:"${answer.selectedChoiceId}" not found in question id:"${question.id}"`);
      }
      let factor = _.find(result.factors, {
        name: question.factor_name
      });
      if (!factor) {
        factor = new req.context.Factor({
          name: question.factor_name,
          value: chosenChoice.value,
          question_counter: 1
        });
        console.log(`push factor to result.factors\n${factor}\n`);
        result.factors.push(factor);
      } else {
        console.log(`factor_name:"${question.factor_name}" found`);
        factor.value += chosenChoice.value;
        factor.question_counter += 1;
      }
    }
    return result;
  };
  const submitAnswerSheet = async (req, res) => {
    const console = req.context.Logger({
      prefix: 'answer/submit controller'
    });
    try {
      console.log(`${req.user._id} ${req.body.userId}`);
      if (!req.user._id.equals(req.body.userId)) {
        res.status(401).end();
      } else {
        const newAnswerSheet = new req.context.AnswerSheet({
          testSheetUid: req.body.testSheetUid,
          userId: req.body.userId,
          jobId: req.user.profile.jobId,
          workPlaceId: req.user.profile.workPlaceId,
          done: req.body.done,
          answers: req.body.answers
        });

        if (!newAnswerSheet.done) {
          throw new Error('answer sheet is not done');
        }

        // load test sheet related to the answer sheet
        const testSheet = await req.context.TestSheet.findOne({
          uid: newAnswerSheet.testSheetUid
        });
        if (!testSheet) {
          throw new Error('Test sheet not found');
        }
        console.log(`test sheet:"${testSheet.uid}"`);

        await newAnswerSheet.save();
        console.log('answer sheet is successfully saved');

        /*
          user handler
        */
        const user = await req.context.User.findOne({
          _id: req.body.userId
        });

        let result = _.find(user.results, {
          testSheetUid: newAnswerSheet.testSheetUid
        });
        if (!result) {
          result = new req.context.Result({
            testSheetUid: newAnswerSheet.testSheetUid,
            factors: []
          });
          result = processResult(result, newAnswerSheet, testSheet, req);
          user.results.push(result);
          console.log(`push new result\n${result}\n`);
        } else {
          result = processResult(result, newAnswerSheet, testSheet, req);
          await result.save();
          console.log(`update result\n${result}\n`);
        }
        user.answers.push(newAnswerSheet.id);
        console.log(`push new answer sheet id:"${newAnswerSheet.id}" to "user.answers"`);
        await user.save();


        /*
          Job handler
        */
        const job = await req.context.Job.findOne({
          id: newAnswerSheet.jobId
        });
        if (!job) {
          throw new Error(`job id:${req.body.jobId} not found`);
        }
        console.log(`job found : ${job}`);
        // update result summary
        result = _.find(job.results, {
          testSheetUid: newAnswerSheet.testSheetUid
        });
        if (!result) {
          result = new req.context.Result({
            testSheetUid: newAnswerSheet.testSheetUid,
            factors: []
          });
          result = processResult(result, newAnswerSheet, testSheet, req);
          job.results.push(result);
          console.log(`push new result\n${result}\n`);
        } else {
          result = processResult(result, newAnswerSheet, testSheet, req);
          console.log(`update result\n${result}\n`);
          await result.save();
        }
        job.answers.push(newAnswerSheet.id);
        console.log(`push new answer sheet id ${newAnswerSheet.id} to job.answers`);
        await job.save();


        /*
          Work place handler
        */
        let workPlace = await req.context.WorkPlace.findOne({
          placeId: newAnswerSheet.workPlaceId
        });
        if (!workPlace) {
          workPlace = new req.context.WorkPlace({
            placeId: newAnswerSheet.workPlaceId
          });
        }
        result = _.find(workPlace.results, {
          testSheetUid: newAnswerSheet.testSheetUid
        });
        if (!result) {
          result = new req.context.Result({
            testSheetUid: newAnswerSheet.testSheetUid,
            factors: []
          });
          result = processResult(result, newAnswerSheet, testSheet, req);
          workPlace.results.push(result);
          console.log(`push new result\n${result}\n`);
        } else {
          result = processResult(result, newAnswerSheet, testSheet, req);
          await result.save();
          console.log(`update result\n${result}\n`);
        }
        workPlace.answers.push(newAnswerSheet.id);
        await workPlace.save();

        res.json(newAnswerSheet);
      }
    } catch (e) {
      console.log(e);
      res.status(500).send(e.toString());
    }
  };

  const createJob = async (req, res) => {
    const console = req.context.Logger({
      prefix: 'job/create controller'
    });
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
