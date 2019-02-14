import { ApolloServer, gql } from 'apollo-server'
import { SchemaDirectiveVisitor } from 'apollo-server'

export default class UpperDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field, details) {
		const { resolve } = field
		field.resolve = async function (...args) {
			const value = await resolve.apply(this, args)
			return typeof value === 'string'? value.toLocaleUpperCase(): value
		}
	}
}

const publicApiInterface = gql`
	directive @upper on FIELD_DEFINITION
	type Query {
		greeting: String @upper
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
	schemaDirectives: {
		upper: UpperDirective,
	}
});

server.listen().then(({url})=> console.log(`server ready at ${url}`))
