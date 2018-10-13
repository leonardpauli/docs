const {performance} = require('perf_hooks')
const bcrypt = require('bcrypt')
const {hashPassword, validatePassword} = require('./hashPassword')
const {login, signup} = require('./api')

describe('bcrypt', ()=> {
	it('generates salt', async ()=> {
		const saltRounds = 10
		const s = performance.now()
		const salt = await bcrypt.genSalt(saltRounds)
		const dur = performance.now() - s
		console.log('bcrypt.generates-salt', salt, dur)
		expect(salt.length).toBeGreaterThan(10)
	})
	it('hashes', async ()=> {
		const plainText = 'fourStaple9'
		const saltRounds = 10
		const salt = await bcrypt.genSalt(saltRounds)
		const s = performance.now()
		const hash = await bcrypt.hash(plainText, salt)
		const dur = performance.now() - s
		const perSec = 1/(dur/1000)
		console.log('bcrypt.hashes', plainText, hash, dur, perSec)
		expect(plainText).not.toBe(hash)
		expect(perSec).toBeGreaterThan(7)
		expect(perSec).toBeLessThan(30)
	})
	describe('validates', ()=> {
		const plainText = 'fourStaple9'
		const plainTextFaulty = 'fourStaple8'
		const saltRounds = 10
		let salt
		let hash
		beforeAll(async ()=> {
			salt = await bcrypt.genSalt(saltRounds)
			hash = await bcrypt.hash(plainText, salt)
		})

		it('right', async ()=> {
			const s = performance.now()
			const matches = await bcrypt.compare(plainText, hash)
			const dur = performance.now() - s
			console.log('bcrypt.validates.right', dur)
			expect(matches).toBe(true)
			expect(dur).toBeLessThan(100)
		})
		it('faulty', async ()=> {
			expect(await bcrypt.compare(plainTextFaulty, hash)).toBe(false)
		})
		it('right wrong order', async ()=> {
			expect(await bcrypt.compare(hash, plainText)).toBe(false)
		})
		it('faulty wrong order', async ()=> {
			expect(await bcrypt.compare(hash, plainTextFaulty)).toBe(false)
		})
	})
})

describe('hashPassword', ()=> {
	it('works', async ()=> {
		const pass = 'my c00! secret 58'
		const hash = await hashPassword(pass)
		console.log('hashPassword', hash)
		expect(await validatePassword({pass, hash})).toBe(true)
		expect(await validatePassword({pass: 'faulty', hash})).toBe(false)
	})
})

describe('api', ()=> {
	it('works', async ()=> {
		// note: don't leak id existance to client, for server only
		// note: id here is user/client provided id, eg. email, not necessarily db id
		const pass = 'secret'
		const id = 1
		const name = 'Anna'

		expect(await login({id, pass})).toBe(null) // non-existing id
		expect(await signup({id, pass, name})).toMatchObject({name}) // signup; credentials does not conflict with any existing
		expect(await login({id, pass})).toMatchObject({name}) // login; credentials match existing account
		
		expect(await login({id, pass: 'secretFaulty'})).toBe(false) // wrong pass/id combo
		expect(await login({id: 2, pass})).toBe(null) // non-existing id
		expect(await signup({id, pass, name: 'Ava'})).toMatchObject({name}) // signup but account credentials match existing account -> login existing account, require confirm to change/update details

		expect(await signup({id: 2, pass, name: 'Erik'})).toMatchObject({name: 'Erik'}) // password unique-ness not checked
		expect((await login({id, pass})).hash).not.toBe((await login({id: 2, pass})).hash) // same pass should result in different hashes (unique salt/pass)
	})
})
