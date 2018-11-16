const fs = require('fs')
const wabt = require('wabt')()

const inputWat = 'main.wat'
const outputWasm = 'main.wasm'

const wasmModule = wabt.parseWat(inputWat, fs.readFileSync(inputWat, 'utf-8'))
const {buffer} = wasmModule.toBinary({})

fs.writeFileSync(outputWasm, Buffer.from(buffer))

