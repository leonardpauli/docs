const jwtEncoderGet = require('./jwtEncoderGet').default
const fs = require('fs')

const config = {
	keys: {
		jwtAuth: {
			private: fs.readFileSync('./keys/jwt-auth', 'utf8'),
			public: fs.readFileSync('./keys/jwt-auth.pub', 'utf8'),
		}
	}
}

const jwtEncoder = jwtEncoderGet({expiresIn: '1d', keys: config.keys.jwtAuth})
const main = async ()=> {
	const token = await jwtEncoder.signAndEncode({id: '5'})
	console.log('token:', token)
	console.log('decoded:', await jwtEncoder.decodeWithoutVerify(token))
	// ...
	const payload = await jwtEncoder.verifyAndDecode(token)
	console.log(payload.id === '5', payload)

	// refresh
	const refreshToken = await jwtEncoder.signAndEncode({id: '5'}, {expiresIn: '6m'})
	// ...
	const refreshPayload = await jwtEncoder.verifyAndDecode(token, {expiresIn: '6m'})
	// ...
}

main().catch(console.error)
