const jwt = require('jsonwebtoken');

const jwtEncoder = (optionsDefault, keys)=> ({
	signAndEncode: (payload, options)=> new Promise((res, rej)=> {
		const cb = (err, token)=> err? rej(err): res(token)
		const opt = {...optionsDefault, ...options}
		jwt.sign(payload, keys.private, {
			maxAge: opt.expiresIn,
			...opt,
		}, cb)
	}),
	verifyAndDecode: (token, options)=> new Promise((res, rej)=> {
		const cb = (err, payload)=> err? rej(err): res(payload)
		const opt = {...optionsDefault, ...options}
		jwt.verify(token, keys.public, opt, cb)
	}),
	decodeWithoutVerify: token=> jwt.decode(token, {complete: true}),
})

const jwtEncoderGet = ({
	expiresIn: '1d', // eg. 6m for refresh-token
	keys: {
		private = void 0, // required for signing
		public, // required for verifying
	}

	subject = void 0 // 'login'
	audience = void 0 // 'client-info-eg-domain+ua_agent'
	
	issuer = void 0 // 'instance/service id'
	jwtid = void 0 // jwtid: 'some id',
} = {})=> jwtEncoder({
	issuer,
	subject,
	audience,
	jwtid,
	expiresIn,
	algorithm: 'RS256', // see theory/cryptography
}, {
	private,
	public,
})

module.exports = {default: jwtEncoderGet}
