// created by Leonard Pauli, 1 mar 2019

/*
Vue is using a "reactive" data flow model.

imperative code: // it performs each line from top to bottom
a = 5
b = 2
c = a+b // c = 7, execute the code and remember the value of a+b right now
b = 3
// c = 7, still

declarative code:
a: 5
b: 2
c: a+b // 7, remember the declaration (a+b)
b: 3
// c is now 8

"declarative" code using "functional programming" in an imperative language:
holder = {}
holder.a = 5
holder.b = 2
holder.c = ()=> holder.a+holder.b // remembers the references to a, b, not their current values
holder.c() // == 7 // evaluates the code, with a,b's current values
holder.b = 3
holder.c() // == 8 // evaluates the code again, with a,b's now current values, which have changed

Though is it possible to have this reactive behaviour, but with a simpler syntax, in an imerative language?
Javascript supports proxies
proxies are put in front of the real value, and can observe and interject when something messes with the real value

const realValue = {age: 5}
const proxiedValue = new Proxy(realValue, {
	get (realValue, key) {
		console.log(`get ${key}`)
		return realValue[key]
	},
	set (realValue, key, value) {
		console.log(`set ${key} to ${value}`)
		realValue[key] = value
	},
})

console.log(proxiedValue.age) // logs "get age", then "5"
proxiedValue.age = 6 // logs "set age to 6"
console.log(proxiedValue.age) // logs "get age", then "6"

(As said, they can also interject by eg. setting a different value or returning a changed one)
Important here though is that we can "spy" on when the value is about to be accessed or changed

To be able to run our code again, we need to put it in a function:

const render = ()=> {
	let text = `Hello ${proxiedValue.name}! Your age is ${proxiedValue.age}`
	console.log(text)
}

We want to run it when any of the used values are changed. How do we know which values has been used/read?

const valuesToWatch = new Set() // Set is an unordered list where a value can only exist once
const proxiedValue = new Proxy(realValue, {
	get (realValue, key) {
		valuesToWatch.add(key)
		return realValue[key]
	},
})

So if we were to call render now, "name" and "age" would be in our valuesToWatch list.

Though how do call render again if any of those values have been changed?

const someValueWasChanged = (key)=> {
	if (valuesToWatch.has(key)) {
		render()
	}
}

const proxiedValue = new Proxy(realValue, {
	get (realValue, key) {
		valuesToWatch.add(key)
		return realValue[key]
	},
	set (realValue, key, value) {
		realValue[key] = value
		someValueWasChanged(key)
	},
})

Cool! So if we change "name" (eg. proxiedValue.name = 'Anna'),
the someValueWasChanged function will be called, and because "name" is in
our valuesToWatch list, it will proceed to call the render function again!

To make this complete, we might want to support multiple different render function
- they might not even be render functions, so lets generalize it to watchHandler.
Also, it we have multiple of those, we should probably keep track on which values
they use separately, so we need to dynamically create "valuesToWatch" lists for
each of them. And in order for the proxy to know which list to add to,
lets make a wrapper object that we set to a variable called eg. target
before invoking the watchHandler. That is:

const allWatchers = new Set()
let target = null

const createNewWatcher = (watchHandler)=> {
	const data = proxiedValue

	const watcher = {}
	watcher.handler = watchHandler
	watcher.valuesToWatch = new Set()
	watcher.run = ()=> {
		target = watcher
		watcher.valuesToWatch.clear()
		watcher.handler(data) // watcher.valuesToWatch will be filled with the now relevant values to watch
		target = null
	}

	watcher.run() // initial run to fill valuesToWatch list

	allWatchers.add(watcher)
	return watcher
}


const realValue = { / * initial data here * / }

const proxiedValue = new Proxy(realValue, {
	get (realValue, key) {
		target.valuesToWatch.add(key)
		return realValue[key]
	},
	set (realValue, key, value) {
		realValue[key] = value
		someValueWasChanged(key)
	},
})

const someValueWasChanged = (key)=> {
	allWatchers.forEach(watcher=> {
		if (watcher.valuesToWatch.has(key)) {
			watcher.run()
		}
	})
}



Awesome! So now, we can use this!

proxiedValue.a = 5
proxiedValue.b = 2

const render = (data)=> {
	const c = data.a + data.b
	console.log(`c is ${c}`)
}

createNewWatcher(render) // c is 7
proxiedValue.b = 3 // c is 8


Almost there! Vue has some additional tricks, like being able to watch
nested data, remove watchers, batch updating, and some other performance
boosts. Though this is the essence of it all!

Now, if we, instead of interacting with some local data (realValue in the
above example), but maybe some data at a different computer/server/backend/database,
just as easy as if it were just local data, could we do that?

Of course! Introducing... custom vue-observable-backends!

We just make a cut in the proxy! The relevant lines:
in get: target.valuesToWatch.add(key)
in set: someValueWasChanged(key)

Btw, vue calls "valuesToWatch" the "dependency list",
and wrapps the key as a "depencency", or "Dep" for short.
Also, "someValueWasChanged" becomes "notify", as in "notify the watchers/observers that a dependency was changed"
with that in mind:

in get: dependency.dependOn(target)
in set: dependency.notifyWatchers()

basically, when a value changes, some sort of "notify" function is called,
and when a value is read/get, some sort of registering occurs.

we could switch these out to register with our own backend, and have our own
backend notify the watchers. And that's pretty much it.


see "custom vue observable backend - proxy fields - remote store.js" for a more in depth example

 */


// Vue hides their Observer and Dep class
// some trickery is neccesary to get it out...

// relevant snippets

(new Observer()).dep.constructor = Dep

value.__ob__ instanceof Observer

Vue.observable = function (obj) {
  observe(obj);
  return obj
};

defineReactiveness

// get/set dep pattern
dep
get (key) {
	if (Dep.target) {
		dep.depend()
	}
},
set (key, val) {
	if (val == prevVal) return
	dep.notify()
}

// vue watcher pattern
const vm = new Vue() // used for this.vm._watchers, ie. teardown pool + this ctx
const teardown = vm.$watch((_vm)=> obs.age, function (value, oldValue) {
	// this = vm
}, {immediate: true})
teardown()


// ...so, let's get the classes!
const {Observer, Dep} = (()=> {
	const raw = {}
	const obs = Vue.observable(raw)
	const ob = obs.__ob__
	const Observer = ob.constructor
	const Dep = ob.dep.constructor
	// target = Dep.target
	return {Observer, Dep}
})()
