// server
// lp-docs-object-storage-api
// 
// Created by Leonard Pauli, 19 mar 2018
// 
// usage: curl -X POST 0.0.0.0:3000/api -H 'Content-Type: application/json' -d '{"actions": [{"type":"doubleNr", "data": 5}]}'
// see available actions in ./actions
// 

const serverBase = require('./utils/server-base')
const apiBase = require('./utils/api-base')

const config = require('./config')
const actions = require('./actions')

const api = apiBase({actions})
const server = serverBase({
	port: config.app.port,
	logging: config.app.logging,
})

// cors
server.app.use(async (ctx, next)=> {
	if (ctx.path.match(/^\/api\/?$/i))
		ctx.response.set('Access-Control-Allow-Origin', '*')
	await next()
})

// api
server.app.use(async (ctx, next)=> {
	if (!ctx.path.match(/^\/api\/?$/i)
		|| !ctx.method==='POST') return next()
	ctx.assert(ctx.is('application/json'), 400, 'expected application/json')
	
	const json = ctx.request.body
	const sendJson = json=> {
		ctx.type = 'application/json'
		ctx.body = JSON.stringify(json)
	}

	const res = await api.handleRequest(json)
	sendJson(res)
})

module.exports = server
