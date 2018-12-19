// /app/node/other/utils
// LeonardPauli/docs
// Created by Leonard Pauli, 6 sep 2018
// quick usage:
// const lpdocs = '/Users/leonardpauli/projects/own/docs'
// const {...} = require(`$lpdocs/app/node/other/utils`)
// const {...} = require(`$lpdocs/app/node/streams/utils`)
// const log   = require(`$lpdocs/app/js/module/string-from-object/module`).default
// TODO: probably better to use ramda-js or similar instead

// helpers
const add = (a, x)=> a+x

// array
const range = n=> Array(n).fill().map((_, i)=> i)
const last = xs=> xs[xs.length-1]
const first = xs=> xs[0]
const sum = xs=> xs.reduce(add)

// promises
const delay = (ms=0)=> {
	let id = null
	const promise = new Promise(res=> id = setTimeout(res, ms))
	promise.cancel = ()=> clearTimeout(id)
	return promise
}
const untilAll = xs=> xs.reduce((ap, p)=> ap.then(a=> p.then(v=> [...a, v])), Promise.resolve([]))
const unpromisifyArr = xs=> untilAll(xs.map(async (v, i)=> xs[i] = await v))


// output
const print = console.log
const toInt = n=> parseInt(n, 10)


// export
module.exports = {
	add,
	range, last, first, sum,
	delay, untilAll, unpromisifyArr,
	print, toInt,
}
