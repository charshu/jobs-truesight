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
    job: Job
    workPlaceId: String
    salary: Int
}
type TestSheet { 
  id: String!
  uid: String!
  title: String
  picture: String
  doneCounter: Int
  instruction: String
  criterias: [Criteria]
  questions: [Question]
}
type Criteria {
  factorName: String!
  factorNameTH: String
  ranges: [Range]!
}
type Range {
  min: Float!
  result: String!
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
  name: String!
  value: Float!
  question_counter: Int
  min: Float
  max: Float
}
type Result {
  testSheetUid: String
  job: Job
  factors: [Factor]
}
type Job {
  id: Int
  name: String
  salary: Salary
  createdAt: Date
  updatedAt: Date
  results: [Result] 
  answerSheets: [AnswerSheet]
  
}
type Salary {
  average:Float
  min:Float
  max:Float
}
type WorkPlace {
  id: String
  viewCount: Int
  participant: Participant
  factorsAvailable: [String]
  results: [Result] 
  answerSheets: [AnswerSheet]
}
type Participant {
  male: Int
  female: Int
  ages: [Int]
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
