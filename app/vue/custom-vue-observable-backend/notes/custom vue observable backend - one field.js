// custom vue observable backend, one field

// start

// get classes
const {Observer, Dep} = (()=> {
	const raw = {}
	const obs = Vue.observable(raw)
	const ob = obs.__ob__
	if (!ob.constructor) throw new Error('Has Vue changed?')
	const Observer = ob.constructor
	const Dep = ob.dep.constructor
	// Dep.target
	return {Observer, Dep}
})()

// create custom backend
const dep = new Dep()
const obs = {
	_age: 5,
	get age () {
		if (Dep.target) dep.depend()
		return this._age
	},
	set age (val) {
		if (val == this._age) return
		this._age = val
		dep.notify()
	},
}

// test
vm = new Vue()
teardown = vm.$watch(()=> obs.age, (value, oldValue)=> {
	console.log(`age updated from ${oldValue} to ${value}`)
}, {immediate: true}) // 5
obs.age++ // 6 skipped (batching)
obs.age++ // 7
setTimeout(()=> {
	obs.age++ // 8
	setTimeout(()=> {
		teardown()
		console.log('teardown')
		obs.age++ // no log
	}, 10)
}, 10)

