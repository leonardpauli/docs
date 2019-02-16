const fs = require('fs').promises
const R = require('ramda')
const path = require('path')
const rmrf = require('rimraf')

const main = async ()=> {
	console.log('build start')
	const f = path.join(__dirname, './dist/out.txt')
	await promisify(rmrf)('./dist')
	await fs.mkdir('./dist').catch(e=> e.code=='EEXIST'?null:Promise.reject(e))
	await fs.writeFile(f, R.toUpper('lal')+'\n')
	console.log('done')
}

const promisify = fn=> async (...args)=> new Promise((resolve, reject)=> fn.call(null, ...[...args, (err, val)=> err? reject(err): resolve(val)]))

main().catch(console.error)
