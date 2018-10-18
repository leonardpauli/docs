import { prisma } from './prisma-generated'


const ctxFree = ()=> ({})

// type Resolver = parent, args, context, info

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
		me: (_, __, ctx)=> ctx.token.user(),
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
		login: async (_, {input: {email: {email, password: pass}}}, ctx)=> ({token: await ctx.token.login({email, pass})}),
		// signup(input: AccountSignupInput): Void
		signup: async (_, { input: {credential: {email: { email, password: pass }}}, name }, ctx) => {
			await ctx.token.signup({ email, pass, name })
		},
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
