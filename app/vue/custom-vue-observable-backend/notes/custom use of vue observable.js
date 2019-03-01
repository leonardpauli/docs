// custom use of vue observable

// start
const raw = {age: 5}

// make observable
const obs = Vue.observable(raw)
const ob = obs.__ob__
if (!ob.constructor) throw new Error('Has Vue changed?')
const Observer = ob.constructor
const Dep = ob.dep.constructor
// Dep.target

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