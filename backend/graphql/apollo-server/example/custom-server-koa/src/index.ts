import * as Koa from 'koa'
import server from './graphql-server'

// config
const config = {PORT: 4032, GRAPHQL_PATH: '/graphql'}

// Server
const app = new Koa()

server.applyMiddleware({ app, path: config.GRAPHQL_PATH });

app.listen({port: config.PORT}, ()=> {
	console.log(`server ready at http://localhost:${config.PORT}${config.GRAPHQL_PATH}`);
})
