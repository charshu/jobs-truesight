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
        title: req.body.title ? req.body.title : 'untitled',
        picture: req.body.picture,
        doneCounter: req.body.doneCounter ? req.body.doneCounter : 0,
        questions: req.body.questions
      });
      await newTestSheet.save();

      console.log('=== successfully save new test===');
      res.json(newTestSheet);
    } catch (e) {
      console.log(e);
      res.status(500).send(e.toString());
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
        name: question.factorName
      });
      if (!factor) {
        factor = new req.context.Factor({
          name: question.factorName,
          value: chosenChoice.value,
          question_counter: 1
        });
        // console.log(`push factor to result.factors\n${factor}\n`);
        result.factors.push(factor);
      } else {
        // console.log(`factorName:"${question.factorName}" found`);
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
      if (!req.user) {
        res.status(401).end();
      } else {
        const newAnswerSheet = new req.context.AnswerSheet({
          testSheetUid: req.body.testSheetUid,
          gender: req.user.profile.gender,
          age_range: req.user.profile.age_range,
          jobId: req.user.profile.jobId,
          workPlaceId: req.user.profile.workPlaceId,
          salary: req.user.profile.salary,
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

        console.log(`test sheet:"${testSheet.doneCounter}"`);

        await newAnswerSheet.save();
        console.log('answer sheet is successfully saved');
        if (!testSheet.doneCounter) {
          testSheet.doneCounter = 0;
        }
        testSheet.doneCounter += 1;
        await testSheet.save();

        /*
          user handler
        */
        const user = await req.context.User.findOne({
          _id: req.user._id
        });
        if (!user) {
          throw new Error('user not found');
        }

        /*
          calculating result for same test sheet
        */
        let result = _.find(user.results, {
          testSheetUid: newAnswerSheet.testSheetUid,
          jobId: newAnswerSheet.jobId
        });
        if (!result) {
          result = new req.context.Result({
            testSheetUid: newAnswerSheet.testSheetUid,
            jobId: newAnswerSheet.jobId,
            factors: []
          });
          result = processResult(result, newAnswerSheet, testSheet, req);
          user.results.push(result);
          // console.log(`push new result\n${result}\n`);
        } else {
          result = processResult(result, newAnswerSheet, testSheet, req);
          await result.save();
          // console.log(`update result\n${result}\n`);
        }
        user.answerSheetsId.push(newAnswerSheet._id);
        console.log(user);
        await user.save();


        /*
          Job handler
        */
        const job = await req.context.Job.findOne({
          _id: newAnswerSheet.jobId
        });
        if (!job) {
          throw new Error(`job id: ${req.body.jobId} not found`);
        }

        /*
          calculating result for same test sheet and same job
        */
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
        } else {
          result = processResult(result, newAnswerSheet, testSheet, req);
          await result.save();
        }
        job.answerSheetsId.push(newAnswerSheet._id);
        console.log(`push new answer sheet id ${newAnswerSheet._id} to job.answers`);
        await job.save();


        /*
          Work place handler
        */
        let workPlace = await req.context.WorkPlace.findOne({
          _id: newAnswerSheet.workPlaceId
        });
        if (!workPlace) {
          workPlace = new req.context.WorkPlace({
            _id: newAnswerSheet.workPlaceId
          });
        }
        /*
          calculating result for same test sheet and same work place
        */
        let resultOnlyWorkPlace = _.find(workPlace.results, {
          testSheetUid: newAnswerSheet.testSheetUid
        });
        if (!resultOnlyWorkPlace) {
          resultOnlyWorkPlace = new req.context.Result({
            testSheetUid: newAnswerSheet.testSheetUid,
            factors: []
          });
          resultOnlyWorkPlace = processResult(resultOnlyWorkPlace, newAnswerSheet, testSheet, req);
          workPlace.results.push(resultOnlyWorkPlace);
        } else {
          resultOnlyWorkPlace = processResult(resultOnlyWorkPlace, newAnswerSheet, testSheet, req);
          await resultOnlyWorkPlace.save();
        }
        /*
          calculating result for same test sheet and same work place and same job
        */
        let resultWorkPlaceAndJob = _.find(workPlace.results, {
          testSheetUid: newAnswerSheet.testSheetUid,
          jobId: newAnswerSheet.jobId
        });
        if (!resultWorkPlaceAndJob) {
          resultWorkPlaceAndJob = new req.context.Result({
            testSheetUid: newAnswerSheet.testSheetUid,
            jobId: newAnswerSheet.jobId,
            factors: []
          });
          resultWorkPlaceAndJob = processResult(resultWorkPlaceAndJob, newAnswerSheet, testSheet, req);
          workPlace.results.push(resultWorkPlaceAndJob);
        } else {
          resultWorkPlaceAndJob = processResult(resultWorkPlaceAndJob, newAnswerSheet, testSheet, req);
          await resultWorkPlaceAndJob.save();
        }

        workPlace.answerSheetsId.push(newAnswerSheet._id);
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
