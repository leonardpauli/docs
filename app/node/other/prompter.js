// /app/node/other/prompter
// LeonardPauli/docs
// Created by Leonard Pauli, 6 sep 2018

const readline = require('readline')


// terminal color wrapper
const cw = (()=> {
	const cw = c=> s=> cw.enable? cw.wrap(c)(s): s
	cw.wrap = (c = false)=> s=> c===false? s: `\x1b[${c}m${s}\x1b[0m`
	cw.enable = true
	cw.color = 'noir red green yellow blue pink cyan white'.split(' ')
		.reduce((o, k, i)=> ((o[k] = new Number(90+i)).dark = 30+i, o), {})
	cw.color.gray = 2
	cw.strip = s=> s.replace(/\u001b\[.*?m/g, '')

	// setup helpers, eg. cw.gray('hello')
	Object.entries(cw.color).map(([k, v])=> {
		const fn = cw[k] = cw(v)
		Object.entries(v).map(([k, v])=> fn[k] = cw(v))
	})

	return cw
})()


// terminal prompter
const prompterGet = ({
	input = process.stdin,
	output = process.stdout,
	questionDefault = '',
	questionSuffixDefault = cw.gray(': '),
	completerDefault = (line)=> {const options = []; return options},
} = {})=> {

	let completerCustom = null
	const completer = (line)=> {
		const options = completerCustom(line)
		return [options, line]
	}

	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		completer,
	})

	// handle close
	let isClosed = false
	rl.on('close', ()=> isClosed = true)

	// handle next line
	let lineNext = null
	let lineNextResolve = null
	const expectLineNext = ()=> lineNext = new Promise((res)=> lineNextResolve = res)
	rl.on('line', line=> lineNextResolve && lineNextResolve(line))

	const next = async ({
		completer = completerDefault,
		question = questionDefault,
		suffix = questionSuffixDefault,
	} = {})=> {
		const done = isClosed
		if (done) return {value: void 0, done}

		const promptMsg = question+suffix
		output.write(promptMsg)

		completerCustom = completer

		return await expectLineNext()
	}

	return {
		next,
		close: ()=> rl.close(),
	}
}


module.exports = {
	prompterGet,
	cw,
}
