const { ApolloServer, gql } = require('apollo-server');
const tmpDataStore = {books: [{title: 'a', author: 'b'}, {title: 'c', author: 'd'}]}
const publicApiInterface = gql`
	type Book { # comment
		title: String! # not-null
		author: String # null-able
	}
	type Query { # "root"-type/entrypoint for requesting information
		books: [Book!]! # list
	}
`
const resolvers = { // implements the publicApiInterface
	Query: { // key matching type
		books: ()=> tmpDataStore.books,
	},
}
const server = new ApolloServer({ typeDefs: publicApiInterface, resolvers })
server.listen().then(({url})=> console.log(`server ready at ${url}`))
