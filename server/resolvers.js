const { find, filter, sortBy } = require('lodash');
const { Kind } = require('graphql/language');

const resolveFunctions = {
  Query: {
    getUser(_, params, ct) {
      if (!ct.user) {
        throw new Error('You have no authorized');
      }
      return ct.User.findOne({ _id: ct.user._id })
      .populate({
        path: 'answerSheetsId'
      })
      .populate({
        path: 'answerSheetsId',
        populate: {
          path: 'jobId',
          model: 'Job'
        }
      })
      .populate({
        path: 'answerSheetsId',
        populate: {
          path: 'workPlaceId',
          model: 'WorkPlace',
          populate: {
            path: 'results.jobId',
            model: 'Job'
          }
        }
      });
    },
    getTestSheet(_, params, ct) {
      return ct.TestSheet.find({});
    },
    getTestSheetByUid(_, params, ct) {
      return ct.TestSheet.findOne({ uid: params.uid });
    },
    // getAnswerSheet(_, params, ct) {
    //   if (!ct.user) {
    //     throw new Error('You have no authorized');
    //   }
    //     // return all answer sheets by user id
    //   return ct.AnswerSheet.find({
    //     userId: ct.user._id
    //   });
    // },
    // getAnswerSheetByUid(_, params, ct) {
    //   if (!ct.user) {
    //     throw new Error('You have no authorized');
    //   }
    //   return ct.AnswerSheet.find({
    //     testSheetUid: params.testSheetUid,
    //     userId: ct.user._id
    //   });
    // },
    getJobsChoice(_, params, ct) {
      return ct.Job.find({}, null, {
        sort: {
          id: 1 // Sort by Date Added DESC
        }
      });
    },
    getJob(_, params, ct) {
      return ct.Job.findOne({ _id: params.id });
    },
    async getWorkPlace(_, params, ct) {
      const place = await ct.WorkPlace.findOneAndUpdate({ _id: params.id }
      , { $inc: { viewCount: 1 } }
      , { new: true })
      .populate({
        path: 'answerSheetsId',
        populate: {
          path: 'jobId',
          model: 'Job'
        }
      })
      .populate({
        path: 'answerSheetsId',
        populate: {
          path: 'workPlaceId',
          model: 'WorkPlace'
        }
      })
      .populate({
        path: 'results.jobId'
      });
      return place;
    }
  },
  // Mutation: {
  //   updateProfile(_, { profile }, ct) {
  //     console.log(profile);
  //     if (!ct.user) {
  //       throw new Error('You have no authorized');
  //     }
  //     return ct.User.findOne({ _id: ct.user.id });
  //   }
  // },
  User: {
    id(user) {
      return user._id;
    },
    answerSheets(user) {
      return sortBy(user.answerSheetsId, 'createdAt').reverse();
    }
  },
  TestSheet: {
    doneCounter(testSheet) {
      if (!testSheet.doneCounter) {
        return 0;
      }
      return testSheet.doneCounter;
    }
  },
  Result: {
    job(result) {
      return result.jobId;
    }
  },
  Job: {
    id(job) {
      return job._id;
    },
    answerSheets(job) {
      return job.answerSheetsId;
    }
  },
  WorkPlace: {
    answerSheets(workPlace) {
      return workPlace.answerSheetsId;
    }
  },
  AnswerSheet: {
    id(answerSheet) {
      return answerSheet._id;
    },
    job(answerSheet) {
      return answerSheet.jobId;
    },
    workPlace(answerSheet) {
      return answerSheet.workPlaceId;
    },
    answers(answerSheet) {
      return sortBy(answerSheet.answers, 'id');
    }
  },
  Question: {
    id(question) {
      return question._id;
    }
  },
  Choice: {
    id(choice) {
      return choice._id;
    }
  },
  Date: {
    __parseValue(value) {
      return new Date(value); // value from the client
    },
    __serialize(value) {
      return value.getTime(); // value sent to the client
    },
    __parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10); // ast value is always in string format
      }
      return null;
    }
  }
};

module.exports = resolveFunctions;
