import { readFileSync } from 'fs'

// TODO: use dotenv?
export default {
	PORT: 4000,
	GRAPHQL_PATH: '/graphql',
	keys: {
		jwtAuth: {
			private: readFileSync('./keys/jwt-auth', 'utf8'),
			public: readFileSync('./keys/jwt-auth.pub', 'utf8'),
		},
	},
}
