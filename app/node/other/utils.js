// /app/node/other/utils
// LeonardPauli/docs
// Created by Leonard Pauli, 6 sep 2018
// quick usage:
// const lpdocs = '/Users/leonardpauli/projects/own/docs'
// const {...} = require(`$lpdocs/app/node/other/utils`)
// const {...} = require(`$lpdocs/app/node/streams/utils`)
// const log   = require(`$lpdocs/app/js/module/string-from-object/module`).default

// helpers
const add = (a, x)=> a+x

// array
const range = n=> Array(n).fill().map((_, i)=> i)
const last = xs=> xs[xs.length-1]
const first = xs=> xs[0]
const sum = xs=> xs.reduce(add)

// promises
const untilAll = xs=> xs.reduce((ap, p)=> ap.then(a=> p.then(v=> [...a, v])), Promise.resolve([]))
const unpromisifyArr = xs=> untilAll(xs.map(async (v, i)=> xs[i] = await v))


// output
const print = console.log
const toInt = n=> parseInt(n, 10)

// output - colors
const cw = c=> s=> cw.useColors? cw.colorWrap(c)(s): s
cw.colorWrap = (c = false)=> s=> c===false? s: `\x1b[${c}m${s}\x1b[0m`
cw.useColors = true
cw.c = 'nrgybpcw'.split('').reduce((o, k, i)=> ((o[k] = new Number(90+i)).d = 30+i, o), {})
cw.strip = s=> s.replace(/\u001b\[.*?m/g, '')

// input helper
// TODO: use http://nodejs.cn/doc/nodejs_4/readline.html instead..
const input = (()=> {
	const input = s=> new Promise(r=> input.add({s, r}))
	input.queueS = []
	input.queueR = []
	input.add = o=> (input.queueS.push(o.s), input.queueR.push(o.r), input.next())
	input.next = ()=> input.queueS.length>0 && input.queueS.length==input.queueR.length && process.stdout.write(`${input.queueS.shift()}: `)
	input.done = ()=> process.stdin.destroy()
	process.stdin.on('data', d=> ((
		input.queueR.shift() || (()=> print('(not waiting for input)'))
	)(d.toString().split('\n')[0]), input.next()))
	// process.stdin.on('data', d=> (s=> s=='\n'
	// 	?	(input.queue.shift().r(input.buffer), input.next())
	// 	: (input.buffer+=s)
	// )(d.toString()))
	//input.buffer = '', input.buffer=''
	return input
})()


// export
module.exports = {
	add,
	range, last, first, sum,
	untilAll, unpromisifyArr,
	print, toInt, cw,
	input,
}
