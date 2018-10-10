const bcrypt = require('bcrypt')

const hashPassword = (plainText, saltRounds = 10)=> bcrypt
	.genSalt(saltRounds)
  .then(salt=> bcrypt.hash(plainText, salt))

const validatePassword = (plainText, {againstHash})=> bcrypt
	.compare(plainText, againstHash)

module.exports = {
	hashPassword,
	validatePassword,
}
