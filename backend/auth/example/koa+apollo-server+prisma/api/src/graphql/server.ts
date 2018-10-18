import { ApolloServer, gql } from 'apollo-server-koa'
import { importSchema } from 'graphql-import'
import directives from './directive'
import resolvers from './resolvers'

const publicApiInterface = gql(importSchema('./src/graphql/schema/index.graphql'))

const server = new ApolloServer({
	typeDefs: publicApiInterface,
	resolvers,
	schemaDirectives: directives,
});

export default server
