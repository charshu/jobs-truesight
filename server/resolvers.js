const { find, filter, sortBy } = require('lodash');
const { Kind } = require('graphql/language');

const resolveFunctions = {
  Query: {
    currentUser(_, params, ct) {
      if (!ct.user) {
        throw new Error('You have no authorized');
      }
      return ct.User.findOne({ _id: ct.user.id });
    },
    getTestSheet(_, params, ct) {
      return ct.TestSheet.find({});
    },
    getTestSheetByUid(_, params, ct) {
      return ct.TestSheet.findOne({ uid: params.uid });
    },
    getAnswerSheet(_, params, ct) {
      if (!ct.user) {
        throw new Error('You have no authorized');
      }
        // return all answer sheets by user id
      return ct.AnswerSheet.find({
        userId: ct.user._id
      });
    },
    getAnswerSheetByUid(_, params, ct) {
      if (!ct.user) {
        throw new Error('You have no authorized');
      }
      return ct.AnswerSheet.find({
        testSheetUid: params.testSheetUid,
        userId: ct.user._id
      });
    },
    getJobsChoice(_, params, ct) {
      return ct.Job.find({}, null, {
        sort: {
          id: 1 // Sort by Date Added DESC
        }
      });
    },
    getJob(_, params, ct) {
      return ct.Job.findOne({ id: params.id });
    },
    getWorkPlace(_, params, ct) {
      // return async () => {
      //   const workPlace = await ct.WorkPlace.findOne({ placeId: params.placeId });
      //   console.log(workPlace.placeId);
      //   return find(workPlace.results, { testSheetUid: params.testSheetUid });
      // };
      return ct.WorkPlace.findOne({ placeId: params.placeId });
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
    }
  },
  AnswerSheet: {
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
