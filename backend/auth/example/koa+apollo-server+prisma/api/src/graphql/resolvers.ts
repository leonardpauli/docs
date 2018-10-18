import { prisma } from './prisma-generated'

const ctxFree = ()=> ({})

const resolvers = {
	Query: {
		Misc: ctxFree,
		// Account: ctxFree,
		User: ctxFree,
		Note: ctxFree,
	},
	MiscModule: {
		greeting: ()=> 'hi!',
	},
	// AccountModule: {},
	UserModule: {
		list: ()=> prisma.users(),
		// me: User! @auth(requireRole: USER)
		me: ()=> {},
	},
	NoteModule: {
		list: ()=> prisma.notes(),
	},

	Mutation: {
		// Misc: MiscModule,
		Account: ctxFree,
		User: ctxFree,
		Note: ctxFree,
	},
	// MiscModuleMutation: {},
	AccountModuleMutation: {
		// login(input: AccountLoginInputEmail): AccountToken
		login: ()=> {},
		// signup(input: AccountSignupInput): Void
		signup: ()=> {},
		// logout: Void @auth(requireRole: USER)
		logout: ()=> {},
		// changePassword(input: AccountChangePasswordInput): Void @auth(requireRole: USER)
		changePassword: ()=> {},
	},
	UserModuleMutation: {
		// nameChange(value: String): Void @auth(requireRole: USER)
		nameChange: ()=> {},
	},
	NoteModuleMutation: {
		// add(text: String!, publish: Boolean! = false): Void @auth(requireRole: USER)
		add: ()=> {},
		// publish(id: ID!, enable: Boolean! = true): Void @auth(requireRole: USER)
		publish: ()=> {},
		// remove(id: ID!): Void @auth(requireRole: USER)
		remove: ()=> {},
	},
}

export default resolvers
