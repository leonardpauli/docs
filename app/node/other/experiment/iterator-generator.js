// experiment/iterator-generator.js
// created by Leonard Pauli, 19 dec 2018
// see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators

const main = async ()=> {

	console.log('rangeIterPlainGet(3) ---')
	let iterGet = ()=> rangeIterPlainGet(3)

	console.log('iterConsumptionPlain')
	iterConsumptionPlain(iterGet())

	let iterable = iterPlainToIterable(iterGet())
	console.log('iterableConsumptionForOf')
	iterableConsumptionForOf(iterable)


	console.log('rangeIterGenerator(3) ---')
	iterGet = ()=> rangeIterGenerator(3)

	console.log('iterConsumptionPlain')
	iterConsumptionPlain(iterGet())

	iterable = iterGeneratorToIterable(iterGet())
	console.log('iterableConsumptionForOf')
	iterableConsumptionForOf(iterable)

}

const iterConsumptionPlain = iter=> {
	let res = null
	while ((res = iter.next(), !res.done))
		console.log(res.value)
}
const iterableConsumptionForOf = iterable=> {
	for (let val of iterable) console.log(val)
}

const rangeIterPlainGet = (n)=> {
	let i = 0
	return {
		next: ()=> {
			const done = i==n
			const value = done? void 0: i++
			return {value, done}
		}
	}
}
const rangeIterGenerator = function *(n) {
	let i = 0
	while (i < n) yield i++
}

const iterPlainToIterable = iter=> {
	return {
		[Symbol.iterator]: ()=> ({
			next: iter.next
		}),
	}
}
const iterGeneratorToIterable = iter=> {
	return {
		*[Symbol.iterator]() {
			yield* iter
		},
	}
}

main().catch(console.error)
