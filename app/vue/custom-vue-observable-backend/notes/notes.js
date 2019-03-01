// created by Leonard Pauli, 1 mar 2019

(new Observer()).dep.constructor = Dep
1020

value.__ob__ instanceof Observer

Vue.observable = function (obj) {
  observe(obj);
  return obj
};

defineReactiveness

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

a = new Vue() // used for this.vm._watchers, ie. teardown pool + this ctx
teardown = a.$watch((a)=> obs.age, (value, oldValue)=> {
	// this = a if non-arrow-fn

}, {immediate: true})

teardown()
