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
type Test { 
  id: String!
  title: String
  questions: [Question]
}
type Question {
  id: String!
  title: String!
  factor: String
  choices: [Choice]
}
type Choice{
  title: String
  value: Int
}

type Profile {
    name: String
    gender: String
    age_range: Int
    location: String
    picture: String
}

type Query {
  posts: [Post]
  author(id: Int!): Author
  currentUser: User
  test(uid:String!): Test
}

type Mutation {
  upvotePost (
    postId: Int!
  ): Post
}

type Subscription {
  postUpvoted: Post
}
`;

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});
