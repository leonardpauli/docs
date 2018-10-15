import * as Koa from 'koa'
import {forPathExact, responseTime} from './middlewares-utility'
import {indexRoute, errorRoute} from './middlewares-custom'

// TODO: use dotenv?
const config = {PORT: 3000}

// Server

const app = new Koa()

app.use(errorRoute)
app.use(responseTime);
app.use(forPathExact('', indexRoute))

app.listen({port: config.PORT}, ()=> {
	console.log(`server ready at http://localhost:${config.PORT}`);
})
