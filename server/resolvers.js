const { find, filter, sortBy } = require('lodash');

const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' }
];

const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'GraphQL Rocks', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 }
];

const resolveFunctions = {
  Query: {
    posts() {
      return posts;
    },
    author(_, { id }) {
      return find(authors, { id });
    },
    currentUser(_, params, ct) {
      if (ct.user !== undefined && ct.user !== null) {
        return ct.User.findOne({ _id: ct.user.id }).then(
          user => new ct.User(user)
        );
      }
      return undefined;
    },
    getTestSheet(_, params, ct) {
      return ct.TestSheet.find({}).then(
          testSheet => testSheet
        );
    },
    getTestSheetByUid(_, params, ct) {
      return ct.TestSheet.findOne({ uid: params.uid }).then(
          testSheet => testSheet
        );
    },
    getAnswerSheet(_, params, ct) {
      if (ct.user !== undefined && ct.user !== null) {
        // return all answer sheets by user id
        return ct.AnswerSheet.find({
          userId: ct.user._id
        }).then(
            answerSheet => answerSheet
          );
      }
      return undefined;
    },
    getAnswerSheetByUid(_, params, ct) {
      if (!ct.user) {
        throw new Error('You have no authorized');
      }
      if (params.done === true) {
        return ct.AnswerSheet.find({
          testSheetUid: params.testSheetUid,
          userId: ct.user._id,
          done: true
        }).then(
            answerSheet => answerSheet
          );
      } else if (params.done === false) {
        return ct.AnswerSheet.find({
          testSheetUid: params.testSheetUid,
          userId: ct.user._id,
          done: false
        }).then(
            answerSheet => answerSheet
          );
      }
      return ct.AnswerSheet.find({
        testSheetUid: params.testSheetUid,
        userId: ct.user._id
      }).then(
            answerSheet => answerSheet
          );
    }
  },
  Mutation: {
    upvotePost(_, { postId }) {
      const post = find(posts, { id: postId });
      if (!post) {
        throw new Error(`Couldn't find post with id ${postId}`);
      }
      post.votes += 1;
      return post;
    },
    saveAnswer(_, params, ct) {
      if (!ct.user) {
        throw new Error('You have no authorized');
      }
      return ct.AnswerSheet.findOneAndUpdate({
        testSheetUid: params.testSheetUid,
        userId: ct.user._id,
        done: false,
        'answers.questionId': params.questionId

      }, {
        $set: {
          'answers.$.selectedChoiceId': params.choiceId
        }
      }, {
        new: true
      }).then(
            (answerSheet) => {
              if (!answerSheet) {
                return ct.AnswerSheet.findOneAndUpdate({
                  testSheetUid: params.testSheetUid,
                  userId: ct.user._id,
                  done: false
                }, {
                  $push: {
                    answers: {
                      questionId: params.questionId,
                      selectedChoiceId: params.choiceId
                    }
                  }
                }, {
                  new: true
                }).then((addedAnswerSheet) => {
                  console.log('addedAnswerSheet: ', addedAnswerSheet);
                  return addedAnswerSheet;
                });
              }
              return answerSheet;
            }
          );
    }
  },
  Subscription: {
    postUpvoted(post) {
      return post;
    }
  },
  Author: {
    posts(author) {
      return filter(posts, { authorId: author.id });
    }
  },
  Post: {
    author(post) {
      return find(authors, { id: post.authorId });
    }
  },
  User: {
    id(user) {
      return user._id;
    },
    email(user) {
      console.log(user.email);
      return user.email;
    }
  },
  TestSheet: {
    questions(testSheet) {
      return sortBy(testSheet.questions, 'id');
    }
  },
  AnswerSheet: {
    answers(answerSheet) {
      return sortBy(answerSheet.answers, 'id');
    }
  },
  Question: {
    choices(question) {
      return question.choices;
    }
  },
  Choice: {
    id(choice) {
      return choice._id;
    }
  }
};

module.exports = resolveFunctions;
