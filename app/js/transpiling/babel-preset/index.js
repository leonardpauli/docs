// babel-preset
// lpdocs
// 
// created by Leonard Pauli, 12 jul 2018
// inspired by https://github.com/vuejs/babel-preset-vue-app

// const path = require('path')

module.exports = (context, {

	// base options (mainly for preset-env)
	modules = null,
	modulesImportStatementsHandledAfterwards = false,
		// eg. by bundeling, babel transformation is otherwise needed
	targets = {
		// node: 'current' || '10.2',
		// browsers: ['last 2 versions', 'safari >= 7'],
		// 	- see https://github.com/browserslist/browserslist
		// 	- use ("browserslist": "last 2 versions, ie 10") in package.json instead
	},
	targetsNodeCurrentForce = false, // when using tests, or running for current node version
	useBuiltIns = 'usage', // only add the ones used (eg. Promise polyfill) (in not already there according to targets)
	debug = false, // show used plugins (only relevant for preset-env?) + polyfills in console

	// other options
	minify = false, // true | false | {...opt} // should be false during dev

} = {})=> ({

	// presets contains plugins contains visitors that modifies the AST of the source code
	// visitor execution order: ...plugins, ...(...presets.reverse)

	presets: [

		// https://babeljs.io/docs/en/next/babel-preset-minify
		// see order above, minify should be run last, thereby top of presets list
		...!minify? []: [[require('babel-preset-minify'), (o=> ({
			...o,
			deadcode: {
				keepFnName: o.keepFnName,
				keepFnArgs: true,
				keepClassName: o.keepClassName,
				...o.deadcode || {},
			},
		}))({
			keepFnName: true,
			keepClassName: true,
			...typeof minify === 'object'? minify: {},
		})]],

		// preset-env, contains transpilation plugins to meet target
		// see https://babeljs.io/docs/en/next/babel-preset-env.html
		// replaces (es2015, es2016, es2017, etc)
		// 	ie. stage 4, but not all of (?) 3, or any of 2 or lower
		[require('@babel/preset-env'), {
			modules: modules!==null? modules: modulesImportStatementsHandledAfterwards? false: 'commonjs',
			targets: {...targets, ...targetsNodeCurrentForce? {node: 'current'}: {}},
			useBuiltIns,
			debug,
		}],

		// see https://github.com/babel/babel/blob/master/packages/babel-preset-stage-2/src/index.js
		// includes plugins in stage 2 + 3, see below
		[require('@babel/preset-stage-2'), {
			useBuiltIns: !!useBuiltIns,
			decoratorsLegacy: true,
		}]

		// transform runtime
		// 	TODO: seems like a good thing, though how to configure best + to avoid unecessary deps + repetitions?
		// plugins.push([require('@babel/plugin-transform-runtime'), {
		// 	helpers: true,
		// 	polyfill: false,
		// 	regenerator: false,
		// 	// moduleName: path.dirname(require.resolve('@babel/runtime/package.json'))
		// 	// 	TODO? issue before, got abs path in transpiled output
		// }])

	],
	// https://babeljs.io/docs/en/next/plugins.html
	// stages: 0: Strawman, 1: Proposal, 2: Draft, 3: Candidate,
	// 	4: Finished (ie. is or will be in js, no need for babel if running latest)
	plugins: [

		// stage <=1, experimental
		// f(?, 1, ...) -> (x, ...y)=> f(x, 1, ...y)

		// stage <=1, experimental
		// async-generators
		// do-expressions
		// export-default-from
		// flow
		// require('@babel/plugin-proposal-function-bind'), // o::fn -> fn.bind(o), ::o.fn -> o.fn.bind(o)
		// jsx
		// logical-assignment-operators
		// [require('@babel/plugin-proposal-nullish-coalescing-operator'), {loose: false}],
			// o.a ?? b -> var _o$a; (_o$a = o.a) !== null && _o$a !== void 0 ? _o$a : b;
		// optional-catch-binding
		// optional-chaining
		// [require('@babel/plugin-proposal-pipeline-operator'), {proposal: 'minimal'}], // a |> c.b |> (x=> x*2) -> c.b(a)*2
		// typescript

		// stage 2; see preset-stage-2
		// [require('@babel/plugin-proposal-decorators'), {legacy: true}], // (before class-properties); @decoratorFn @fn2(...) class A {...}
		// require('@babel/plugin-proposal-function-sent'),
		// require('@babel/plugin-proposal-export-namespace-from'),
		// require('@babel/plugin-proposal-numeric-separator'),
		// require('@babel/plugin-proposal-throw-expressions'),

		// stage 3; see preset-stage-2
		// require('@babel/plugin-syntax-dynamic-import'), // allows parsing of import(x) as async require?
		// require('@babel/plugin-syntax-import-meta'),
		// require('@babel/plugin-proposal-async-generator-functions'),
		// [require('@babel/plugin-proposal-class-properties'), {loose: true}], // class A { prop = 5; static prop = 7 }
		// require('@babel/plugin-proposal-json-strings'),
		// [require('@babel/plugin-proposal-object-rest-spread'), {loose: true, useBuiltIns: !!useBuiltIns}],
		// require('@babel/plugin-proposal-optional-catch-binding'),
		// require('@babel/plugin-proposal-unicode-property-regex'),
		
	],
})
