const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const schema = `
scalar Date
type User {
  id: String
  email: String
  profile: Profile
  results: [Result]
  answerSheets: [AnswerSheet]
}
type Profile {
    name: String
    gender: String
    age_range: Int
    location: String
    picture: String
    jobId: Int
    workPlaceId: String
    salary: Int
}
type TestSheet { 
  id: String!
  uid: String!
  title: String
  picture: String
  doneCounter: Int
  questions: [Question]
}
type Question {
  id: String!
  title: String!
  factorName: String
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
  gender: String
  age_range: Int
  job: Job
  workPlace: WorkPlace
  salary: Int
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
  createdAt: Date
  updatedAt: Date
  results: [Result] 
  answerSheets: [AnswerSheet]
  
}
type WorkPlace {
  id: String
  viewCount: Int
  results: [Result] 
  answerSheets: [AnswerSheet]
}
type Query {
  getUser: User
  getTestSheet: [TestSheet]
  getTestSheetByUid(uid:String!): TestSheet

  getJobsChoice: [Job]
  getJob(id:Int!): Job
  getWorkPlace(id:String!): WorkPlace
  
}

`;

  // getAnswerSheet: [AnswerSheet]
  // getAnswerSheetByUid(testSheetUid:String): [AnswerSheet]
// input Profile {
//     userId: String
//     name: String
//     gender: String
//     age_range: Int
//     location: String
//     picture: String
//     jobId: Int
//     workPlaceId: String
// }
// type Mutation {
//   updateProfile(profile: Profile!): User
// }

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});
