import * as jwt from 'jsonwebtoken'

// TODO: review + format for better security/clarity

const mergeObjs = xs=> xs.reduce((o, x)=> Object.assign(o, x), {})
const withoutVoidFields = o=> mergeObjs(Object.keys(o).filter(k=> o[k]!==void 0).map(k=> ({[k]: o[k]})))

const jwtEncoder = (optionsDefault, keys)=> ({
	signAndEncode: (payload, options)=> new Promise((res, rej)=> {
		const cb = (err, token)=> err? rej(err): res(token)
		const opt = withoutVoidFields({...optionsDefault, ...options})
		jwt.sign(payload, keys.private, opt, cb)
	}),
	verifyAndDecode: (token, options)=> new Promise((res, rej)=> {
		const cb = (err, payload)=> err? rej(err): res(payload)
		const opt = {...optionsDefault, ...options}
		if (opt.algorithm) {
			opt.algorithms = [opt.algorithm]
			delete opt.algorithm
		}
		jwt.verify(token, keys.public, withoutVoidFields({
			maxAge: opt.expiresIn,
			...opt,
		}), cb)
	}),
	decodeWithoutVerify: token=> jwt.decode(token, {complete: true}),
})

const jwtEncoderGet = ({
	expiresIn = '1d', // eg. 6m for refresh-token
	keys = {},
	
	subject = void 0, // 'login'
	audience = void 0, // 'client-info-eg-domain+ua_agent'
	
	issuer = void 0, // 'instance/service id'
	jwtid = void 0, // jwtid: 'some id',
} = {})=> jwtEncoder({
	issuer,
	subject,
	audience,
	jwtid,
	expiresIn,
	algorithm: 'RS256', // see theory/cryptography
}, {
	private: keys.private, // required for signing
	public: keys.public, // required for verifying
})

export default jwtEncoderGet
