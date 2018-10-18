import * as bcrypt from 'bcrypt'

const hashPassword = (plainText, saltRounds = 10)=> bcrypt
	.genSalt(saltRounds)
	.then(salt=> bcrypt.hash(plainText, salt))

const validatePassword = ({pass: plainText, hash: againstHash})=> bcrypt
	.compare(plainText, againstHash)

export {
	hashPassword,
	validatePassword,
}
