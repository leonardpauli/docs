import { ApolloServer, gql } from 'apollo-server-koa'

const publicApiInterface = gql`
	type Query {
		greeting: String
	}
`;

const resolvers = {
	Query: {
		greeting: ()=> 'hi',
	},
}

const server = new ApolloServer({
	typeDefs: publicApiInterface,
	resolvers,
});

export default server
