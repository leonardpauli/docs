#!/usr/bin/env node
// app/node/other/laptimer
// LeonardPauli/docs
// created by Leonard Pauli, 8 sep 2018

const lpdocs = '/Users/leonardpauli/projects/own/docs'
const {
	add,
	range, last, first, sum,
	delay, untilAll, unpromisifyArr,
	print, toInt,
} = require(lpdocs+'/app/node/other/utils')
const {prompterGet, cw} = require(lpdocs+'/app/node/other/prompter')

const readline = require('readline')
const fs = require('fs')



const main = async ()=> {
	const output = process.stdout

	const appendOptions = appendOptionsGet()
	printStartupInfo({output, appendOptions})

	// TODO: load lapses from appendTo file
	// 	TODO: load only eg. last 3 lines from end of file

	let i = 0
	const startDate = new Date()
	const lapses = []

	const completer = line=> {
		const prevLines = lapses.slice().reverse().map(({title})=> title)
		const matched = prevLines.filter(c=> c.indexOf(line)==0)
		return matched
	}

	const pr = prompterGet({
		output,
		completerDefault: completer,
	})

	let line = null
	while (line = await pr.next({
		question: ''+cw.cyan(i),
	}), !pr.done) {
		if (line=='exit') break

		const lapse = lapseFromLine(line)
		const commentStr = lapseCommentStrGet({lapse, startDate, lapses, i})
		appendCommentStr({output, lapse, i, commentStr})
		appendLapseToFile({appendOptions, lapse})

		lapses.push(lapse)
		i++
	}

	pr.close()
	
	if (appendOptions.stream) appendOptions.stream.end()
	else printLapsesCsv({output, lapses})
}


// subroutines

const appendOptionsGet = ()=> {
	const appendPath = process.argv[2]
	const append = {
		enabled: !!appendPath,
		path: appendPath,
		stream: null,
	}
	if (append.enabled) append.stream = fs.createWriteStream(append.path, {flags: 'a'})
	return append
}

const printStartupInfo = ({output, appendOptions})=> output.write(
	cw.cyan('laptimer')
	+cw.gray(` [${appendOptions.path || 'append-to.tsv'}], exit to exit, other messages to title laps, enter to start`)
	+(appendOptions.enabled? cw.gray('\noptions: appending to '+cw.yellow.dark(appendOptions.path)): '')
	+'\n')

const lapseFromLine = line=> {
	const date = new Date()
	const title = line
	const lapse = {date, title}
	return lapse
}

const lapseCommentStrGet = ({lapse, startDate, lapses, i})=> {
	const msSinceStart = lapse.date - startDate
	const msSinceLast = lapses.length? lapse.date - last(lapses).date: 0
	const hh = doubleDigit(lapse.date.getHours())
	const mm = doubleDigit(lapse.date.getMinutes())
	const dur = durFormatted(msSinceLast)
	const commentStr = `${hh}:${mm}, ${dur}`
	return commentStr
}

const appendCommentStr = ({output, lapse, i, commentStr})=> {
	const dx = (i+' : '+lapse.title).length-1
	const dy = -1
	readline.moveCursor(output, dx, dy)
	output.write(cw.gray(` // ${commentStr}\n`))
}

const appendLapseToFile = ({appendOptions, lapse})=> {
	if (!appendOptions.enabled) return
	const line = objectToTSV(lapsPrepareForTSV(lapse))
	appendOptions.stream.write(line+'\n')
}

const printLapsesCsv = ({output, lapses})=> output.write(
	'\n----\n'
	+listOfObjectsToTSV(lapses.map(lapsPrepareForTSV))+'\n')

const durFormatted = ms=> {
	const sAll = Math.round(ms/1000)
	const s = sAll%60
	const m = Math.floor(sAll/60)
	if (sAll < 10) return (ms/1000)+'s'
	if (m < 1) return `${s}s`
	if (m < 10) return `${m}m ${s}s`
	return `${m}m`
}


// helpers

const doubleDigit = (n, s=n+'')=> s.length==1?'0'+s:s

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
