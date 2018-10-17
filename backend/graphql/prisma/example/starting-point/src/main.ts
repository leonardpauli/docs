import { ApolloServer, gql } from 'apollo-server'
import {prisma, UserUpdateInput} from './generated/prisma'

/*
https://www.prisma.io/docs/1.17/get-started/01-setting-up-prisma-demo-server-a001/
https://www.prisma.io/docs/get-started/04-explore-features-f001/
https://github.com/prisma/prisma-examples/tree/master/typescript-graphql-auth
https://github.com/prisma/prisma-examples/issues/3
*/

interface IBook {
	title: string,
	author: string,
}


const tmpDataStore: { books: IBook[]} = {books: [{title: 'Elkrets', author: 'Bill'}, {title: 'Block', author: 'you'}]}
const typeDefs = gql`
	type Book {
		title: String!
		author: String!
	}
	type Query {
		books: [Book!]!
	}
`
const resolvers = {
	Query: {
		books: ()=> tmpDataStore.books,
	}
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }: {url: string}) => console.log(`server ready at ${url}`))

// async function main() {
	// const newUser = await prisma.createUser(
	// 	{ name: 'Anna' },
	// );
	// console.log(`created user ${newUser.name} (${newUser.id})`);

	// const allUsers = await prisma.users();
	// console.log(allUsers);

	// const user = await prisma.user({
	// 	id: 'some id',
	// });	
// }

// main().catch(console.error)
