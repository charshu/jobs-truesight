const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const schema = `
scalar Date
type User {
  id:String
  email: String!
  profile: Profile
}

type Profile {
    name: String
    gender: String
    age_range: Int
    location: String
    picture: String
    jobId: Int
    workPlaceId: String
}

type TestSheet { 
  id: String!
  uid:String!
  title: String
  questions: [Question]
}

type Question {
  id: Int!
  title: String!
  factor: String
  choices: [Choice]
}
type Choice{
  id : String
  title: String
  value: Float
}
type Answer {
  questionId: Int!
  selectedChoiceId: String!
}
type AnswerSheet {
  id: String!
  testSheetUid: String
  userId: String
  jobId: Int
  workPlaceId: String
  done: Boolean
  answers: [Answer]
}

type Factor {
  factor: String
  value: Float
}
type Result {
  testSheetUid:String
  factors:[Factor]
}

type Job {
  id: Int
  name: String
  results:[Result] 
  answers:[Answer]
  createdAt:Date
  updatedAt:Date
}

type Query {
  currentUser: User
  getTestSheet: [TestSheet]
  getTestSheetByUid(uid:String!): TestSheet
  getAnswerSheet: [AnswerSheet]
  getAnswerSheetByUid(testSheetUid:String!,done:Boolean): [AnswerSheet]
  getJobsChoice: [Job]
}



`;

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});
