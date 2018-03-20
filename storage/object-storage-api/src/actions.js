const awsFunctions = require('./aws-functions')

const actions = {
	doubleNr: async ctx=> ctx.data*2,
	getPresignedUrl: async ctx=> awsFunctions.getPresignedUrl(ctx.data),
}

module.exports = actions
