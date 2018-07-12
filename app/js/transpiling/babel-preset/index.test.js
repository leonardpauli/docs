// babel-preset/test
// lpdocs
// 
// created by Leonard Pauli, 12 jul 2018
// inspired by https://github.com/vuejs/babel-preset-vue-app

const preset = require('./index.js')
const babel = require('@babel/core')

const transform = (code, options = {})=> babel.transform(code, {
	presets: [[preset, options]],
}).code

describe('simple', ()=> {

	it('does something', ()=> {
		const org = 'const a = x=> x*2'
		const res = transform(org)
		expect(res).toMatch('"use strict"')
		expect(res).toMatch('var a = function a(x) {')
	})

	it('modules; import -> require', ()=> {
		const org = 'import a from "."; a()'
		const res = transform(org)
		expect(res).toMatch('require(".")')
	})

	it('modules; keep import', ()=> {
		const org = 'import a from "."; a()'
		const res = transform(org, {modulesImportStatementsHandledAfterwards: true})
		expect(res).not.toMatch('require(".")')
	})

	it('minify', ()=> {
		const org = 'const keep = x=> x*2'
		const res = transform(org, {minify: true})
		expect(res).toMatch('"use strict"')
		expect(res).toMatch('var keep=function keep(a){return 2*a};')
	})

	// TODO: use @babel/plugin-transform-runtime to reduce output size?
	// it('async', ()=> {
	// 	const org = 'const a = async ()=> await fn'
	// 	const res = transform(org)
	// 	expect(res).toMatch('"use strict"')
	// 	expect(res).toMatch('var a = function a(x) {')
	// })

})
