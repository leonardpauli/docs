import {Middleware, errorHandlerGet} from './middlewares-utility'

export const indexRoute: Middleware = async ctx=> {
	ctx.body = 'hello'
}

export const errorRoute: Middleware = errorHandlerGet(async (err, ctx)=> {
	if (ctx.status === 404) {
		ctx.body = '404 - Not Found!'
		return
	}
	ctx.body = 'Some error!'
})
