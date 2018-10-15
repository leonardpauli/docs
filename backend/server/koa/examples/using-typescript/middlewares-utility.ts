import {performance} from 'perf_hooks'
import * as Koa from 'koa'


export type Middleware = (ctx: Koa.Context, next: ()=> Promise<any>) => Promise<any>

export const isPathMatchExact = (actual: string, expected: string) =>
	actual.replace(/^\/|\/$/g, '').toLowerCase() === expected.toLowerCase()

export const forPathExact = (path: string, middleware: Middleware): Middleware=> (ctx, next)=>
	isPathMatchExact(ctx.path, path)? middleware(ctx, next): next()

export const responseTime: Middleware = async (ctx, next) => {
	const s = performance.now()
	await next()
	const ms = performance.now() - s
	ctx.set('X-Response-Time', `${ms}ms`) // header
}

type errorHandlerHandler = (err, ctx)=> Promise<void>
export const errorHandlerGet: (handler: errorHandlerHandler)=> Middleware = (
	handler: errorHandlerHandler,
)=> async (ctx, next)=> {
	try {
		await next()
		const status = ctx.status || 404
		if (status === 404) ctx.throw(404)
	} catch (err) {
		ctx.status = err.status || 500
		await handler(err, ctx)
	}
}
