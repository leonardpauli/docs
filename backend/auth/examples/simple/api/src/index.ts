import * as Koa from 'koa'
import {forPathExact, responseTime} from './middleware/utility'
import {indexRoute, errorRoute} from './middleware/custom'
import config from './config'
import server from './graphql/server'


// Server

const app = new Koa()

app.use(errorRoute)
app.use(responseTime);
server.applyMiddleware({ app, path: config.GRAPHQL_PATH });
app.use(forPathExact('', indexRoute))

app.listen({port: config.PORT}, ()=> {
	console.log(`server ready at http://localhost:${config.PORT}${config.GRAPHQL_PATH}`);
})
