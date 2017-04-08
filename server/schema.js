const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const schema = `
scalar Date
type User {
  id: String
  email: String!
  profile: Profile
  results:[Result] 
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
  uid: String!
  title: String
  questions: [Question]
}
type Question {
  id: String!
  title: String!
  factor_name: String
  choices: [Choice]
}
type Choice{
  id : String
  title: String
  value: Float
}
type Answer {
  questionId: String!
  selectedChoiceId: String!
}
type AnswerSheet {
  id: Int!
  testSheetUid: String
  userId: String
  jobId: Int
  workPlaceId: String
  done: Boolean
  createdAt: Date
  updatedAt: Date
  answers: [Answer]
}
type Factor {
  name: String
  value: Float
  question_counter: Int
}
type Result {
  testSheetUid: String
  factors: [Factor]
}
type Job {
  id: Int
  name: String
  results: [Result] 
  answers: [Int]
  createdAt: Date
  updatedAt: Date
}
type WorkPlace {
  placeId: String
  results: [Result] 
  answers: [Int]
}
type Query {
  currentUser: User
  getTestSheet: [TestSheet]
  getTestSheetByUid(uid:String!): TestSheet
  getAnswerSheet: [AnswerSheet]
  getAnswerSheetByUid(testSheetUid:String): [AnswerSheet]
  getJobsChoice: [Job]
  getJob(id:Int!): Job
  getWorkPlace(placeId:String!): WorkPlace
}
`;

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});
