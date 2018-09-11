#!/usr/bin/env node
// app/node/other/laptimer
// LeonardPauli/docs
// created by Leonard Pauli, 8 sep 2018

const lpdocs = '/Users/leonardpauli/projects/own/docs'
const {
	add,
	range, last, first, sum,
	untilAll, unpromisifyArr,
	print, toInt, cw,
	input,
} = require(lpdocs+'/app/node/other/utils')
const rl = require('readline')
const fs = require('fs')


const main = async ()=> {

	const appendPath = process.argv[2]
	const append = {
		enabled: !!appendPath,
		path: appendPath,
		stream: null,
	}
	if (append.enabled) append.stream = fs.createWriteStream(append.path, {flags: 'a'})

	print(
		cw(cw.c.c)('laptimer')+
		cw(2)(' [append-to.tsv], exit to exit, other messages to title laps, enter to start')+
		(append.enabled? cw(2)('\noptions: appending to '+cw(cw.c.y.d)(append.path)): '')
	)

	let i = 0
	let title = 'start'
	let startDate = null
	let lapses = []

	while ((title = await input(cw(cw.c.c.d)(i))) != 'exit') {
		const date = new Date()
		let comment = ''
		if (!startDate)	{
			startDate = date
			comment = ' // '+startDate
		}

		const msSinceStart = date-startDate
		const msSinceLast = lapses.length? date-last(lapses).date: 0
		lapses.push({date, msSinceStart, msSinceLast, title})

		rl.moveCursor(process.stdout, (i+' : '+title).length-1, -1)
		const doubleDigit = (n, s=n+'')=> s.length==1?'0'+s:s
		const time = doubleDigit(date.getHours())+':'+doubleDigit(date.getMinutes())
		process.stdout.write(cw(2)(` // ${time}, ${msSinceLast/1000}s${comment}\n`))

		if (append.enabled) append.stream.write(
			objectToTSV(lapsPrepareForTSV(last(lapses)))+'\n')

		i++
	}
	input.done()

	if (append.stream) append.stream.end()
	else print(
		'\n----\n'+
		listOfObjectsToTSV(lapses.map(lapsPrepareForTSV))
	)

}


// subs
const lapsPrepareForTSV = ({date, title})=> ({date: date*1, title})

// TODO: just removes tabs in cells, better way?
// TODO: move to node/stream/utils and return stream instead
// 	(allows better processing of huge objects)
const listOfObjectsToTSV = xs=> {
	if (!xs.length) return ''
	const keys = Object.keys(xs[0])
	const header = keys.map(cleanedTabs).join('\t')
	const lines = xs.map(x=> objectToTSV(x, keys)).join('\n')
	return `${header}\n${lines}`
}
const objectToTSV = (x, keys=Object.keys(x))=>
	keys.map(k=> x[k]).map(cleanedTabs).join('\t')
const cleanedTabs = s=> (s+'').replace(/\t/ig, ' ')

// start
main().then().catch(console.error)
