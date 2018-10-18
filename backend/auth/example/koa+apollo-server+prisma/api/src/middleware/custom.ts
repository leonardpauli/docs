import {Middleware, errorHandlerGet} from './utility'
import api from '../api'

export const indexRoute: Middleware = async ctx=> {
	ctx.body = 'hello'
}

export const errorRoute: Middleware = errorHandlerGet(async (err, ctx)=> {
	console.error(err)
	if (ctx.status === 404) {
		ctx.body = '404 - Not Found!'
		return
	}
	ctx.body = 'Some error!'
})

export const jwtAuth: Middleware = async (ctx, next) => {
	const token = ctx.get('x-token')
	// @ts-ignore
	ctx.token = await api.Account.tokenContextHelperGet({token})
	await next()
}
