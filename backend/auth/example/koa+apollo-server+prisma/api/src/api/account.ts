import { prisma, Role } from '../graphql/prisma-generated'
import {hashPassword, validatePassword} from './hashPassword'
import jwtEncoderGet from './jwtEncoderGet'
import config from '../config'

const jwtEncoder = jwtEncoderGet({expiresIn: '7d', keys: config.keys.jwtAuth})

const tokenGet = ({user})=> jwtEncoder.signAndEncode({
	userId: user.id,
	roles: user.roles,
})

const tokenContextHelperGet = async ({token})=> {
	const payload = token? (await jwtEncoder.verifyAndDecode(token)) || {}: {}
	const decoded = {
		...payload,
		roles: payload.roles && Array.isArray(payload.roles)? payload.roles: [],
	}
	const cache = {
		user: null,
	}
	return {
		decoded,
		cache,
		isUser: ()=> typeof decoded.userId === 'string' && decoded.userId.length,
		user: async ()=> cache.user || (cache.user = await prisma.user({id: decoded.userId})),
		hasRole: (role: Role)=> (cache.user || decoded).roles.includes(role),
		login,
		signup,
	}
}

const login = async ({email, pass})=> {
	const user = await prisma.user({email})
	if (!user) return {user: null, token: null}
	if (!await validatePassword({pass, hash: user.hash})) return {user, token: null}
	return {user, token: tokenGet({user})}
}

const signup = async ({email, pass, ...rest})=> {
	const {user, token} = await login({email, pass})
	if (user && token) return {user, token}
	// TODO: don't leak which emails are registered
	if (user) throw new Error('email already registred')

	const userNew = await prisma.createUser({
		...rest,
		email, emailVerified: false,
		hash: await hashPassword(pass),
		roles: {set: "USER"},
	})
	return tokenGet({ user: userNew })
}

export default {
	login, signup,
	tokenContextHelperGet,
}
