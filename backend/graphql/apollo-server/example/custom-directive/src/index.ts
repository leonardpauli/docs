import { ApolloServer, gql } from 'apollo-server'
import Intl from './directives/Intl'

type Book = {title: string, author: string | null}
type Store = {books: Book[]}

const tmpDataStore: Store = {books: [
	{title: 'a', author: 'b'},
	{title: 'c', author: 'd'},
]}

const publicApiInterface = gql`
	directive @intl on FIELD_DEFINITION
	type Query {
		greeting: String @intl
	}
	type Book {
		title: String!
		author: String
	}
	type Query {
		books: [Book!]!
	}
`;

const resolvers = {
	Query: {
		books: ()=> tmpDataStore.books,
	},
}

const server = new ApolloServer({
	typeDefs: publicApiInterface,
	resolvers,
	schemaDirectives: {
		intl: Intl,
	}
});

server.listen().then(({url})=> console.log(`server ready at ${url}`))
