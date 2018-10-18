import { ApolloServer, gql } from 'apollo-server-koa'
import { importSchema } from 'graphql-import'
import { prisma } from './prisma-generated'
import directives from './directive'


const publicApiInterface = gql(importSchema('./src/graphql/schema.graphql'))

const resolvers = {
	Query: {
		greeting: ()=> 'hi',
		users: ()=> prisma.users(),
	},
}

const server = new ApolloServer({
	typeDefs: publicApiInterface,
	resolvers,
	schemaDirectives: directives,
});

export default server
