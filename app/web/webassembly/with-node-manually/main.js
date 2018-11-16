 const fs = require('fs')

const main = async ()=> {
	const buffer = fs.readFileSync('./main.wasm')
	const module = await WebAssembly.compile(buffer)
	const instance = await WebAssembly.instantiate(module)
	console.log(instance.exports.helloWorld())
}

main().catch(console.error)

