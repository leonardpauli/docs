const _ = require('lodash')
const R = require('ramda')

// note: use with eg. typescript?!

it('concat', ()=> {
	console.log(R.concat([5, 6], [[7, 8]]))
})

it('t1', ()=> {
	// https://gist.github.com/vvgomes/451ea5ca2c65e87c92e4
	const companies = [
		{ name: 'tw', since: 1993 },
		{ name: 'pucrs', since: 1930 },
		{ name: 'tw br', since: 2009 },
	]

	const r1 = _(companies).chain()
		.filter(c=> c.name.split(' ')[0] === 'tw')
		.map(c=> ({
			name: c.name.toUpperCase(),
			since: c.since,
		}))
		.sortBy(c=> c.since)
		.reverse()
		.value()

	console.log('with lodash:', r1)

	const r2 = R.compose(
		R.reverse,
		R.sortBy(R.prop('since')),
		R.map(R.over(R.lensProp('name'), R.toUpper)),
		R.filter(R.where({ name: R.test(/^tw/) }))
	)(companies)

	console.log('with ramda:', r2)

	const r3 = (companies || [])
	  .filter(c=> c.name && c.name.startsWith('tw'))
	  .map(c=> ({ ...c, name: c.name.toUpperCase() }))
	  .sort((a, b)=> b.since - a.since)
})


/*

// https://github.com/ramda/ramda/issues/1578
git clone https://github.com/CrossEye/ramda.github.io
cd ramda.github.io
npm install
npm run gitbook  # may take a while the first time
node node_modules/gitbook-cli/bin/gitbook serve manual

https://ramdajs.com/docs/#last

 */