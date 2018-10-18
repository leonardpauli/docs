import * as Koa from 'koa'
import {forPathExact, responseTime} from './middleware/utility'
import { indexRoute, errorRoute, jwtAuth } from './middleware/custom'
import config from './config'
import server from './graphql/server'


// Server

const app = new Koa()

// TODO: cors option request return early
app.use(errorRoute)
app.use(responseTime);
app.use(jwtAuth);
server.applyMiddleware({ app, path: config.GRAPHQL_PATH });
app.use(forPathExact('', indexRoute))

app.listen({port: config.PORT}, ()=> {
	console.log(`server ready at http://localhost:${config.PORT}${config.GRAPHQL_PATH}`);
})
