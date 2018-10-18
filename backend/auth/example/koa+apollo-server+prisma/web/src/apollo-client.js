import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import config from './config'

const httpLink = new HttpLink({
	uri: config.graphql_uri, // url.abs
})

const apolloClient = new ApolloClient({
	link: httpLink,
	cache: new InMemoryCache(),
	connectToDevTools: true,
})

export default apolloClient
