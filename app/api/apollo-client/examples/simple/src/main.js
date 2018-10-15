import Vue from 'vue'
import VueApollo from 'vue-apollo'
import App from './App'
import apolloClient from './apollo-client'

const apolloProvider = new VueApollo({ defaultClient: apolloClient })

Vue.use(VueApollo)

new Vue({
	el: '#app',
	apolloProvider,
	render: h=> h(App),
})
