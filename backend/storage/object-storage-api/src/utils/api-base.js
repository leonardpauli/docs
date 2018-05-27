// api-base
// lp-docs-object-storage-api
// 
// Created by Leonard Pauli, 19 mar 2018
//

const apiBase = ({actions = {}} = {})=> ({
	actions,
	ctx: {
		assert (condition, error) {
			if (condition) return
			throw error
		},
	},
	async handleAction (ctx, action) {
		if (typeof action!=='object') return {err: 'expected action to be object'}
		if (typeof action.type!=='string') return {err: 'expected action.type to be string'}

		const apiAction = this.actions[action.type]
		if (typeof apiAction!=='function') return {err: 'action not found'}

		try {return {res: await apiAction(action)}}
		catch (err) {return {err}}
	},
	async handleRequest (req) {
		const ctx = {...this.ctx}
		ctx.assert(typeof req==='object', 'expected req to be object')
		ctx.assert(Array.isArray(req.actions), 'expected req.actions to be array')

		// TODO: dependencies
		// 	actions: [
		// 		{type: "prepareSomething", id: 33}, // random int
		// 			// ability to populate context
		// 		{type: "doSomethingAfterPrepared", dependencies: [33]},
		// 			// ability to bind value from populated context to param?
		// 	]
		// 	-> [{id: 33, res: 'ok'}, {res: 'ok'}]

		const promiseAll = ps=> {
			const res = []
			const allDone = ps.reduce((root, p)=> root.then(()=> p.then(r=> res.push(r))), Promise.resolve())
			return {res, allDone}
		}

		const {res, allDone} = promiseAll(req.actions.map(action=> this.handleAction(ctx, action)))
		await allDone
		return res
	},
})

module.exports = apiBase
