// app/node/streams/utils.js
// LeonardPauli/docs
// Created by Leonard Pauli, 31 may 2018

const {Transform} = require('stream')

const toLines = ({
	delemitter = /\r?\n/,
	last = null,
	skipEmptyLast = true,
} = {})=> new Transform({
	readableObjectMode: true,
	transform (chunk, _encoding, cb) { // use Decode from ./modules/split?
		const xs = chunk.toString().split(delemitter) // better to manually split and do this.push for each part?
		;(xs[0] = (last || '')+xs[0], last = xs.pop(), xs).map(t=> this.push(t))
		cb(null)
	},
	final (cb) {
		typeof last==='string' && (!skipEmptyLast || last.length) && this.push(last)
		cb(null)
	},
})

// eg. JSON.parse(await streamToString(fs.createReadStream(..., 'utf-8'))) ...
const streamToString = (stream, {last = ''} = {})=> new Promise((resolve, reject)=> stream
	.on('data', c=> last += c.toString())
	.on('end', ()=> resolve(last))
	.on('error', err=> reject(err))
)

const mapChunks = (fn, {
	readsObj = true,
	writesObj = true,
} = {})=> new Transform({
	writableObjectMode: readsObj,
	readableObjectMode: writesObj,
	transform: async (chunk, _, cb)=> cb(null, await fn(chunk)),
})

const linesToTsvObjects = ({header = null} = {})=>
	mapChunks(s=> (s = s.split('\t'), !header
		? (header = s, void 0)
		: header.reduce((obj, key, i)=> (obj[key] = s[i] || null, obj), {})
	))

const streamToTsvObjects = stream=> stream
	.pipe(toLines())
	.pipe(linesToTsvObjects())

const toJSONStringifiedLines = ()=>
	mapChunks(s=> JSON.stringify(s)+'\n', {writesObj: false})

const sleep = ms=> new Promise(r=> setTimeout(r, ms))

module.exports = {
	toLines, mapChunks,
	linesToTsvObjects, streamToTsvObjects,
	toJSONStringifiedLines, streamToString,
	sleep,
}
