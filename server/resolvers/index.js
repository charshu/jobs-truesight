// Simple resolvers
const { GQC } = require('graphql-compose');
const { GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');


const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    name: {
      type: GraphQLString
    },
    createdAt: {
      type: GraphQLString
    }
  }
});

GQC.rootQuery().addFields({
  users: {
    type: new GraphQLList(UserType),
    resolve: () => [
      {
        name: 'Rungsikorn',
        createdAt: new Date().toISOString()
      }
    ]
  }
});
