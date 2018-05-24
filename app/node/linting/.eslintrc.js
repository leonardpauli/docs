// $lpdocs/app/node/linting/.eslintrc.js
// Created by Leonard Pauli, 2017-2018
// javascript style rules
// 
// see $lpdocs/app/node/linting

/* eslint max-lines:0, import/no-commonjs:0, import/no-nodejs-modules:0 */

/* global process */
// eslint-disable-next-line no-process-env
const isProduction = process.env.NODE_ENV === 'production'
const isRoot = true
const allowConsoleLog = true
const useVue = true
const useReact = false
const useImport = false
const useImportWebpackResolve = false
const useImportNoCommonjs = false
const useFlow = false
const useNode = false
const useJest = true

const off = 0
const warn = 1
const ERROR = 2

module.exports = {
	root: isRoot,
	parserOptions: {
		parser: 'babel-eslint',
		sourceType: 'module',
		// ecmaVersion: 2018,
	},
	env: Object.assign({
		browser: true,
		// es6: true,
	}, useNode? {
		node: true,
	}:{}),
	extends: useVue? ['plugin:vue/recommended']: 'eslint:recommended',
		// required to lint *.vue files
	plugins: [
		useVue && 'vue',
		useReact && 'react',
		useReact && 'jsx-a11y',
		useImport && 'import',
		useFlow && 'flowtype',
		// 'prefer-object-spread',
	].filter(function (a) {return !!a}), // TODO: ok to remove
	// check if imports actually resolve
	settings: Object.assign({}, useImportWebpackResolve && {
		'import/resolver': {
			webpack: {
				config: 'build/webpack.base.conf.js',
			},
		},
	} || {}),
	rules: Object.assign({

		'no-underscore-dangle': [off, { allowAfterThis: true }],


		'accessor-pairs': ERROR,
		'array-bracket-spacing': warn,
		'array-callback-return': warn,
		'arrow-body-style': warn,
		'arrow-parens': [warn, 'as-needed'],
		'arrow-spacing': [warn, {
			before: false,
			after: true,
		}],
		'block-scoped-var': ERROR,
		'block-spacing': [warn, 'always'],
		'brace-style': [warn, '1tbs', {
			allowSingleLine: true,
		}],
		'callback-return': ERROR,
		camelcase: [ERROR, {properties: 'never'}],
		'capitalized-comments': off,
		// "capitalized-comments": ["warn", "never", {
		// 	//"ignorePattern": "pragma|ignored",
		//     "ignoreInlineComments": true,
		//     ignoreConsecutiveComments: true,
		//   }],
		'class-methods-use-this': off,
		// would have been neat with a better way of indicating that it is wanted
		// 	(in super)
		// [warn, { exceptMethods:
		// 	['getStateUpdates', 'render'],
		// }],
		'comma-dangle': [warn, 'always-multiline'],
		'comma-spacing': [warn, { before: false, after: true }],
		'comma-style': [ERROR, 'last'],
		complexity: [ERROR, { max: 20 }],
		'computed-property-spacing': [ERROR, 'never'],
		'consistent-return': off, // would like consistant having a return
		// statement or not, while allowing different return types
		// 'consistent-return': [warn, {
		// 	"treatUndefinedAsUnspecified": true,
		// }],
		'consistent-this': [ERROR, 'self'],
		// 'curly': [warn, "multi-line"], // would like:
		// - single line if short
		// - single under if one but longer
		// - brackets if multi-line
		curly: off,
		'default-case': ERROR,
		'dot-location': [ERROR, 'property'],
		'dot-notation': [ERROR, {
			allowKeywords: true,
		}],
		'eol-last': [warn, 'always'],
		eqeqeq: off, // TODO
		'func-call-spacing': ERROR,
		'func-name-matching': ERROR,
		'func-names': [warn, 'as-needed'],
		'func-style': [ERROR, 'expression'],
		'generator-star-spacing': [ERROR, {
			before: false,
			after: true,
		}],
		'global-require': off,
		'guard-for-in': ERROR,
		'handle-callback-err': ERROR,
		'id-blacklist': ERROR,
		'id-length': off,
		// 'id-length': [warn, {
		// 	min: 2, max: 40,
		// 	exceptions: ['x', 'e', 'y', 'i', 'k', 'v', 'w', ''],
		// }],
		'id-match': ERROR,
		indent: [warn, 'tab', {
			// MemberExpression: 0,
			SwitchCase: 1,
			FunctionDeclaration: {body: 1, parameters: 1},
			CallExpression: {arguments: 1},
			ArrayExpression: 1,
			ObjectExpression: 1,
		}],
		
		'init-declarations': off, // want: discourage use of let, but in some situations,
		// ie callbacks ref capturing, you usually want to initialize to undefined...

		'jsx-quotes': [warn, 'prefer-double'],
		'key-spacing': [warn, {mode: 'minimum'}],
		'keyword-spacing': [ERROR, { before: true, after: true }],
		'line-comment-position': off,
		'linebreak-style': [ERROR, 'unix'],
		'lines-around-comment': warn,
		'lines-around-directive': warn,
		'max-depth': [ERROR, 4],
		'max-len': [off, { // TODO: 1
			tabWidth: 2,
			code: 100,
			ignoreTrailingComments: true,
		}],
		'max-lines': [warn, 1350], // TODO: 350
		'max-nested-callbacks': [ERROR, { max: 4 }],
		'max-params': [warn, 5],
		'max-statements': [warn, 30, { ignoreTopLevelFunctions: true }],
		'max-statements-per-line': [warn, { max: 4 }],
		'multiline-ternary': off,
		'new-cap': off, // TODO: 1
		'new-parens': ERROR,
		'newline-after-var': off, // maybe? not in tiny places
		'newline-before-return': off, // maybe? not in tiny places
		// should be constrained by line length
		// ie. if line is "}).reverse()", it should be ok even if there
		// where 100 chained calls before
		'newline-per-chained-call': [warn, { ignoreChainWithDepth: 4 }],
		'no-alert': ERROR,
		'no-array-constructor': ERROR,
		'no-await-in-loop': warn,
		// if Promisify.all([...]) is possible, use it instead.
		// If each iteration relies on value from prev, then it is ok.
		'no-bitwise': ERROR,
		'no-caller': ERROR,
		'no-catch-shadow': ERROR,
		'no-compare-neg-zero': ERROR,
		'no-confusing-arrow': off, // solved by arrow-spacing fn=> ...
		// allow debugger during development
		'no-debugger': isProduction ? ERROR : off,
		// TODO: error in env production
		'no-console': isProduction
			? [ERROR, { allow: ['warn', 'error'] }]
			: [warn, { allow: [
				'warn', 'error',
				'ignoredYellowBox', 'disableYellowBox', // for react native
				...!allowConsoleLog?[]:['log', 'dir'],
			] }],
		'no-constant-condition': warn,
		'no-continue': off, // buu
		'no-div-regex': ERROR,
		'no-duplicate-imports': ERROR, // hmm.. propably good
		'no-else-return': warn,
		'no-empty-function': [warn],
		'no-empty': [warn],
		'no-eq-null': ERROR,
		'no-eval': ERROR,
		'no-extend-native': ERROR,
		'no-extra-bind': ERROR,
		'no-extra-boolean-cast': warn,
		'no-extra-label': ERROR,
		// 'no-extra-parens': off, // Want; but flow type casting (value: DestinationType)
		// - just `// eslint-ignore-line no-extra-parens`
		// 	at those rare lines; should be avoided anyways
		'no-extra-parens': [warn, 'all', {
			nestedBinaryExpressions: false,
			returnAssign: false,
			ignoreJSX: 'multi-line',
		}],
		'no-floating-decimal': ERROR,
		'no-implicit-globals': ERROR,
		'no-implied-eval': ERROR,
		'no-inline-comments': off, // warn, except for ()=> { /**/ } and short ones
		'no-invalid-this': off, // eg. export default function () {this...}
		'no-iterator': ERROR,
		'no-label-var': ERROR,
		'no-labels': ERROR,
		'no-lone-blocks': ERROR,
		'no-lonely-if': ERROR,
		'no-loop-func': ERROR,
		'no-magic-numbers': off,
		// would be neat, although not for react styling
		// 'no-magic-numbers': [warn, {ignore:[1,0,2]}],
		'no-mixed-operators': off, // would be good to have for ie: a || b && c || d
		'no-mixed-requires': ERROR,
		'no-multi-assign': off,
		'no-multi-spaces': warn,
		'no-multi-str': ERROR,
		'no-native-reassign': ERROR,
		'no-negated-condition': off, // good for ()=> !condition ? short : long
		'no-negated-in-lhs': ERROR,
		'no-nested-ternary': off, // almost.. but nah..
		'no-new': ERROR,
		'no-new-func': ERROR,
		'no-new-object': ERROR,
		'no-new-require': ERROR,
		'no-new-wrappers': ERROR,
		'no-octal-escape': ERROR,
		'no-param-reassign': off, // when fixing default values multilevel (single level handled like fn(a=3))
		'no-path-concat': ERROR,
		'no-plusplus': off,
		// [warn, { allowForLoopAfterthoughts: true, }],
		'no-process-env': off, // TODO
		'no-process-exit': ERROR,
		'no-proto': ERROR,
		'no-prototype-builtins': off,
		'no-restricted-globals': ERROR,
		'no-restricted-imports': ERROR,
		'no-restricted-modules': ERROR,
		'no-restricted-properties': ERROR,
		'no-restricted-syntax': ERROR,
		'no-return-assign': off,
		'no-return-await': ERROR, // `async ()=> await x` === `async ()=> x`
		'no-script-url': ERROR,
		'no-self-compare': ERROR,
		'no-sequences': off,
		'no-shadow': off, // like to allow overwrite by fn arguments, but otherwise no?
		'no-shadow-restricted-names': ERROR,
		'no-spaced-func': ERROR,
		'no-sync': ERROR,
		'no-tabs': off,
		'no-template-curly-in-string': ERROR,
		'no-ternary': off,
		'no-throw-literal': ERROR,
		'no-trailing-spaces': [ERROR, {
			skipBlankLines: true,
		}],
		'no-undef-init': ERROR,
		'no-undefined': off, // best to just write undefined in ES5
		'no-undef': ERROR,
		'no-unmodified-loop-condition': ERROR,
		'no-unneeded-ternary': ERROR,
		'no-unreachable': warn,
		'no-unused-expressions': [off, { // ie. a |> b |> c
			allowShortCircuit: true,
			allowTernary: false,
		}],
		'no-use-before-define': [ERROR, { variables: false }],
		'no-useless-call': ERROR,
		'no-useless-computed-key': ERROR,
		'no-useless-concat': ERROR,
		'no-useless-constructor': off,
		'no-useless-escape': ERROR,
		'no-useless-rename': ERROR,
		'no-useless-return': warn,
		'no-var': ERROR,
		'no-void': off, // used like: return void fn(); // calls fn, then returns undefined
		'no-warning-comments': off, // maybe before going into
		// staging... good notes for future work though
		'no-whitespace-before-property': ERROR,
		'no-with': ERROR,
		'nonblock-statement-body-position': [ERROR, 'any'],
		'object-curly-newline': off, // TODO maybe
		'object-curly-spacing': off, // TODO maybe
		'object-property-newline': off,
		// the following would be disallowed:
		// [ERROR, {
		// 	allowMultiplePropertiesPerLine: true,
		// }],
		// ie. if an object starts/ends on different lines, those should be counted as the same line
		// 	so if allowMultiplePropertiesPerLine is on, it usually means:
		// [a, {b: 2, d: 3}, c] // allowed
		// [a, {b: 2, d: 3}, \n c] // not allowed
		// [a, {\nb: 2,\n d: 3\n}, c] // I would like to allow this
		'object-shorthand': [warn],
		'one-var': off, // maybe, but not in tiny block
		'one-var-declaration-per-line': ERROR,
		'operator-assignment': ERROR,
		'operator-linebreak': [warn, 'after', {
			overrides: {
				'||': 'before',
				'&&': 'before',
				':': 'ignore',
				'?': 'before',
			},
		}],
		'padded-blocks': off, // 'never', yes, but not if tiny block or first line is comment
		'prefer-arrow-callback': warn,
		'prefer-const': warn,
		'prefer-destructuring': [warn, {
			VariableDeclarator: {
				array: true,
				object: true,
			},
			AssignmentExpression: {
				array: false,
				object: false,
			},
		}, {
			enforceForRenamedProperties: false,
		}],
		'prefer-numeric-literals': ERROR,
		'prefer-promise-reject-errors': ERROR,
		'prefer-reflect': off,
		'prefer-rest-params': ERROR,
		'prefer-spread': ERROR,
		'prefer-template': off, // TODO: would be nice in some cases...
		'quote-props': [ERROR, 'as-needed', { numbers: true }],
		quotes: [warn, 'single', { allowTemplateLiterals: true }],
		radix: ERROR,
		'require-await': off, // nope, better to write async ()=> x than ()=> Promise.resolve(x), etc
		'require-jsdoc': [warn, {require: {
			FunctionDeclaration: false,
			MethodDefinition: false,
			ClassDeclaration: false, // TODO: set to true when time allows
			// + get jsdoc plugin for editor + auto doc generator
		}}],
		'rest-spread-spacing': ERROR,
		semi: [ERROR, 'never'],
		'no-unexpected-multiline': warn,
		'semi-spacing': [ERROR, {
			after: true,
			before: false,
		}],
		'sort-imports': off,
		'sort-keys': off,
		'sort-vars': ERROR,
		'space-before-blocks': ERROR,
		'space-before-function-paren': [warn, 'always'],
		'space-in-parens': [warn, 'never'],
		// sometimes nice to be able to group with space if many nested ie. }) )] ) )
		'space-infix-ops': off,
		'space-unary-ops': ERROR,
		'spaced-comment': [warn, 'always', {
			line: {
				markers: ['/', ':'],
			},
			block: {
				markers: ['!', ':'],
				exceptions: ['*', '::'],
				balanced: true,
			},
		}],
		strict: ERROR,
		'symbol-description': ERROR,
		'template-curly-spacing': ERROR,
		'template-tag-spacing': ERROR,
		'unicode-bom': [ERROR, 'never'],
		'valid-jsdoc': warn,
		'vars-on-top': ERROR,
		'wrap-iife': ERROR,
		'wrap-regex': ERROR,
		'yield-star-spacing': ERROR,
		yoda: [ERROR, 'never', { exceptRange: true }],


		// added
		'no-multiple-empty-lines': [warn, { max: 3, maxEOF: 0, maxBOF: 0 }],
		
		// misc
		/*
		'prefer-object-spread/prefer-object-spread': ERROR,
		*/


	}, useImport? {
		'import/named': ERROR,
		'import/no-unresolved': warn,
		'import/default': ERROR,
		'import/namespace': ERROR,
		'import/export': ERROR,
		'import/first': warn,
		'import/no-duplicates': ERROR,
		'import/prefer-default-export': off,
		'import/no-commonjs': useImportNoCommonjs? off: ERROR,
		'import/no-amd': ERROR,
		'import/no-nodejs-modules': ERROR,
		'import/extensions': [ERROR, 'never', { js: 'never' }],
		// allow optionalDependencies
		// 'import/no-extraneous-dependencies': [ERROR, {
		// 	optionalDependencies: ['test/unit/index.js'],
		// }],


	}:{}, useReact? {
		'react/prop-types': ERROR, // TODO
		// 'no-unused-vars': off, // TODO
		'no-unused-vars': [warn, {
			argsIgnorePattern: '(Expo)|(nextState)|(prevState)|^_',
		}],
		'react/jsx-uses-vars': warn,

		// crashed on type x = {...otherType}
		'react/default-props-match-prop-types': [warn, { allowRequiredDefaults: false }],

		'react/jsx-curly-spacing': [warn, 'never'],
		'react/jsx-key': ERROR,
		'react/jsx-no-comment-textnodes': ERROR,
		'react/jsx-no-duplicate-props': ERROR,
		'react/jsx-no-target-blank': ERROR,
		'react/jsx-no-undef': ERROR,
		'react/jsx-uses-react': ERROR,

		'react/display-name': ERROR,
		'react/no-children-prop': ERROR,
		'react/no-danger-with-children': ERROR,
		'react/no-deprecated': ERROR,
		'react/no-direct-mutation-state': ERROR,
		'react/no-find-dom-node': ERROR,
		'react/no-is-mounted': ERROR,
		'react/no-render-return-value': ERROR,
		'react/no-string-refs': ERROR,
		'react/no-unescaped-entities': ERROR,
		'react/no-unknown-property': ERROR,
		'react/react-in-jsx-scope': ERROR,
		'react/require-render-return': ERROR,


	}:{}, useFlow? {
		// https://github.com/gajus/eslint-plugin-flowtype
		// TODO: go through, config, and fix
		'flowtype/boolean-style': [warn, 'boolean'],
		'flowtype/define-flow-type': warn,
		'flowtype/delimiter-dangle': [warn, 'always-multiline'],
		'flowtype/generic-spacing': [warn, 'never'],
		'flowtype/no-primitive-constructor-types': ERROR,
		'flowtype/no-types-missing-file-annotation': ERROR,
		// 'flowtype/no-weak-types': ERROR,
		'flowtype/object-type-delimiter': [warn, 'comma'],
		// 'flowtype/require-parameter-type': ERROR,
		// 'flowtype/require-return-type': [warn, 'always', {
		// 	annotateUndefined: 'never',
		// 	excludeArrowFunctions: true,
		// }],
		'flowtype/require-valid-file-annotation': ERROR,
		'flowtype/semi': [ERROR,	'never'],
		'flowtype/space-after-type-colon': [warn,	'always'],
		'flowtype/space-before-generic-bracket': [warn,	'never'],
		'flowtype/space-before-type-colon': [warn,	'never'],
		// 'flowtype/type-id-match': [ERROR,	'^([A-Z][a-z0-9]+)+Type$'],
		'flowtype/union-intersection-spacing': [warn, 'always'],
		'flowtype/use-flow-type': warn,
		'flowtype/valid-syntax': warn,


	}:{}, useVue? {
		'vue/max-attributes-per-line': off,
		'vue/require-default-prop': off,

		
	}:{}),

	overrides: [
		useJest && {
			// https://stackoverflow.com/a/49211283/1054573
			// for extend in overrides, see https://github.com/eslint/eslint/issues/8813
			files: [
				'**/__tests__/*-test.js',
				'**/*.test.js',
			],
			env: {
				jest: true
			},
			plugins: ['jest'],
			rules: {
				'jest/no-disabled-tests': warn,
				'jest/no-focused-tests': ERROR,
				'jest/no-identical-title': ERROR,
				'jest/prefer-to-have-length': warn,
				'jest/valid-expect': ERROR
			}
		}
	].filter(function (a) {return !!a}), // TODO: ok to remove
}
