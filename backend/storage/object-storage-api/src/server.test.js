// npm i -D jest supertest // jest is testing tool, supertest if api testing helpers
// vi package.json
// 	"scripts": {
// 		"test": "jest"
// 	},
// 	"jest": {
// 		"testEnvironment": "node"
// 	}
// 

const supertest = require('supertest')
const config = require('./config')
config.app.logging = false // disable req logging
const server = require('./server')


describe('testing', ()=> {it('works', ()=> expect(1+1).toBe(2))})
describe('server', ()=> {

	let agent
	const sendReq = req=> agent.post('/api')
		.set('Content-Type', 'application/json')
		.send(JSON.stringify(req))

	beforeEach(()=> {
		server.listen(()=> void 0) // disable listen on port message
		agent = supertest(server.server)
	})
	afterEach(done=> {
		server.server.close(done)
	})

	it('doubleNr', async ()=> expect(await sendReq({actions: [
		{ type: 'doubleNr', data: 5 },
	]})).toMatchObject({
		status: 200,
		type: 'application/json',
		body: [{res: 10}],
	}))

	let res
	it('many getPresignedUrl', async ()=> (expect(res = await sendReq({actions: [
		{ type: 'getPresignedUrl', data: {kind: 'avatar'} },
		{ type: 'getPresignedUrl' },
	]})).toMatchObject({
		status: 200,
		type: 'application/json',
	}), expect(res.body.length).toBe(2), expect(res.body[0].res).toMatch(/avatar/)))
	
})
