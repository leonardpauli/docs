// custom vue observable backend, proxy fields, remote store
// created by Leonard Pauli, 1 mar 2019
// 
// const Vue = require('Vue')
// usage:
// 	cd ..
// 	python -m SimpleHTTPServer 8081
// 	open http://localhost:8081
// 	open browser console
// 	paste the contents of this file in the console, hit enter
// 	


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


// remote store
const remoteStore = {
	vals: {},
	subs: {},
	sub (key, fn) {
		const nosubs = !this.subs[key]
		if (nosubs) {
			this.subs[key] = {}
			Object.defineProperty(this.subs[key], 'nextid', {
				value: 0,
				writable: true,
				enumerable: false,
			})
		}

		const id = this.subs[key].nextid++
		this.subs[key][id] = fn
		console.log(`🌎: "${key}": listener added`)

		if (nosubs) {
			console.log(`🌎: "${key}": start listening`)
		}

		const unsub = ()=> {
			delete this.subs[key][id]
			console.log(`🌎: "${key}": listener removed`)
			if (Object.keys(this.subs[key])==0) {
				console.log(`🌎: "${key}": stop listening`)
			}
		}

		const immediate = true
		if (immediate) setTimeout(()=> {
			fn(this.vals[key])
		}, 300)

		return unsub
	},
	set (key, val) {
		setTimeout(()=> { // simulate remote update / taking some time
			console.log(`🌎: "${key}": value updated to (${val})`)
			this.vals[key] = val
			const subs = this.subs[key]
			if (!subs) return
			Object.keys(subs).forEach(k=> subs[k](val))
		}, 300)
	},
}


// create custom backend ("async" proxy to remoteStore using dependency tracking + notify)
const ctx = {
	deps: {},
}
const obs = new Proxy(ctx, {
	get: (ctx, key)=> {
		// console.log(`🏠: "${key}": get`)
		if (Dep.target) {
			const existing = ctx.deps[key]
			const dep = existing || (ctx.deps[key] = new Dep())
			dep.depend()

			if (!existing) {
				console.log(`🏠: "${key}": Dep created`)

				const _removeSub = dep.removeSub
				dep.removeSub = function (sub) {
					_removeSub.call(this, sub)
					if (!this.subs.length) {
						dep.remoteUnsub()
						delete ctx.deps[key]
						console.log(`🏠: "${key}": Dep removed`)
					}
				}
				dep.remoteUnsub = remoteStore.sub(key, val=> {
					console.log(`🏠: update from 🌎 (${key}: ${val})`) // 🌐
					const dep = ctx.deps[key]
					if (!dep) return
					dep.remoteValCache = val
					dep.notify()
				})
			}
			return dep.remoteValCache
		}
		const dep = ctx.deps[key]
		if (dep) return dep.remoteValCache
		throw new Error(`Doesn't make sense to get proxied-observale value "${key}" `
			+`when there is no one watching.`
			+`\n\nTip: Put the code in a watcher function or `
			+`add a watcher to the property and dispose it afterwards, eg.:`
			+`\n\tconst teardown = (new Vue()).$watch(()=> obj["${key}"], ()=> {`
			+`\n\t\tconsole.log(obj["${key}"]); teardown() });`)
	},
	set: (ctx, key, val)=> {
		// console.log(`🏠: "${key}": set`)
		const dep = ctx.deps[key]
		if (dep) {
			if (val == dep.remoteValCache) return
		}
		// TODO: will spam if no dep put set same val multiple times
		// 	dep independent debounce?
		remoteStore.set(key, val)
	},
})


// test
vm = new Vue()
teardown = vm.$watch(()=> `${obs.name} is ${obs.age}`, (value, oldValue)=> {
	console.log(`(${oldValue}) -> (${value})`)
}, {immediate: true}) //

obs.age = 5
obs.name = 'anna'
setTimeout(()=> {
	obs.age++
	setTimeout(()=> {
		teardown()
		console.log('teardown')
		let err = null
		try {
			obs.age++
		} catch (e) {
			err = e
		}
		if (!err || !err.message.match(/no one watching/))
			throw new Error('should have gotten error, got'+err)
		{
			const teardown = (new Vue()).$watch(()=> obs["age"], ()=> {
				console.log(obs["age"]++);
				teardown()
			});
		}
	}, 400)
}, 400)
