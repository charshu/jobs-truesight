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
  email: String!
  profile: Profile

}
type Profile {
    name: String
    gender: String
    age_range: Int
    location: String
    website: String
    picture: String
}

type Query {
  posts: [Post]
  author(id: Int!): Author
  user(id: String!): User
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
