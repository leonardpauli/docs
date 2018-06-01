#!/usr/bin/env node
// usage:
// (echo hello,some; sleep 1; echo more,fields) | node example.js
// (printf %s hello,some; sleep 1; printf '%s\n' more,fields) | node example.js
// (printf %s hello,some; sleep 1; printf %s thing$'\n'some; sleep 1; printf '%s' more,fields) | node example.js
// (echo $'\n'; echo hello,some$'\n'ss$'\n'; sleep 1; echo more,fields) | node example.js 0
// cat my.tsv | $lpdocs/app/node/streams/example.js tsvSimple

const main = ()=> {
	const program = {simple, tsvSimple}[process.argv[2] || 'simple']
	if (!program) throw `invalid program name '${program}'`
	program()
}

const simple = ()=> {
	const {toLines, mapChunks, toJSONStringifiedLines} = require('./utils')
	process.stdin
		.pipe(toLines())
		.pipe(mapChunks(s=> s?s:null)) // filter out empty
		.pipe(mapChunks(s=> s.split(',')))
		.pipe(toJSONStringifiedLines())
		.pipe(process.stdout)	
}

const tsvSimple = ()=> {
	const {toLines, linesToTsvObjects, toJSONStringifiedLines} = require('./utils')
	process.stdin
		.pipe(toLines())
		.pipe(linesToTsvObjects())
		.pipe(toJSONStringifiedLines())
		.pipe(process.stdout)
}

main()
