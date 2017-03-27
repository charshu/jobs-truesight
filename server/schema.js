const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolvers');

const schema = `

type Author {
  id: Int!
  firstName: String
  lastName: String
  posts: [Post]
}
type Post {
  id: Int!
  title: String
  author: Author
  votes: Int
}
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
  value: Int
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

type Query {
  posts: [Post]
  author(id: Int!): Author
  currentUser: User
  getTestSheet: [TestSheet]
  getTestSheetByUid(uid:String!): TestSheet
  getAnswerSheet: [AnswerSheet]
  getAnswerSheetByUid(testSheetUid:String!,done:Boolean): [AnswerSheet]
}

type Mutation {
  upvotePost (
    postId: Int!
  ): Post
  saveAnswer (testSheetUid:String!,questionId: Int!,choiceId: String!): AnswerSheet
}

type Subscription {
  postUpvoted: Post
}
`;

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});
