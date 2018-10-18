import AuthDirective from './auth'
import PrivateDirective from './private'
import ValidateDirective from './validate'
import prismaMock from './prisma-mock'

export default {
	...prismaMock,
	auth: AuthDirective,
	private: PrivateDirective,
	validate: ValidateDirective,
}
