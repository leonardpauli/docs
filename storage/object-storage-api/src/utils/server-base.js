// server-base
// lp-docs-object-storage-api
// 
// Created by Leonard Pauli, 19 mar 2018
//
// npm i -S koa koa-bodyparser
// 

const Koa = require('koa')
const bodyParser = require('koa-bodyparser')

const serverBase = ({port, logging = true})=> {

	const app = new Koa()
	app.use(bodyParser())
	// see https://github.com/koajs/bodyparser
	// see http://koajs.com/
	// also see http://koajs.com/ for http status code translations

	// x-response-time
	// app.use(async (ctx, next)=> {
	// 	const start = Date.now()
	// 	await next()
	// 	const ms = Date.now() - start
	// 	ctx.set('X-Response-Time', `${ms}ms`)
	// })

	// req logger
	logging && app.use(async (ctx, next)=> {
		const start = Date.now()
		await next()
		const ms = Date.now() - start
		console.log(`${ctx.method} ${ctx.url} - ${ms}`)
	})

	// TODO error handling
	// app.on('error', (err, ctx)=> {
	//   log.error('server error', err, ctx)
	// })

	// TODO: gzip
	// // Accept-Encoding: gzip, deflate
	// ctx.acceptsEncodings();
	// // => ["gzip", "deflate", "identity"]

	// TODO: send cache status response with etag
	// ctx.response.etag = crypto.createHash('md5').update(ctx.body).digest('hex');
	// ctx.status = 200; ctx.set('ETag', '123'); // freshness check requires status 20x or 304
	// if (ctx.fresh) {ctx.status = 304; return} // cache is ok
	// ctx.body = await db.find('something') // cache is stale - fetch new data
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag

	const ret = {
		app,
		server: null,
		listen: (
			fn = ({port, server})=> {
				console.log(`listening on ${port}`)
				server.on('error', err=> console.error('server error: ', err))
				return server
			},
		)=> new Promise((res, rej)=> ret.server = app.listen(port, err=> err? rej(err): res(fn({port, server: ret.server})))),
	}
	return ret
}

module.exports = serverBase
