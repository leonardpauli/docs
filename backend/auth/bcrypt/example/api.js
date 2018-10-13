const {hashPassword, validatePassword} = require('./hashPassword')

const db = {users: {}}

const login = async ({id, pass})=> {
	const user = db.users[id]
	if (!user) return null
	if (!await validatePassword({pass, hash: user.hash})) return false
	return user
}

const signup = async ({id, pass, ...rest})=> {
	const existingUser = await login({id, pass})
	if (existingUser !== null) return existingUser
	return db.users[id] = {...rest, id, hash: await hashPassword(pass)}
}

module.exports = {
	login, signup,
}
