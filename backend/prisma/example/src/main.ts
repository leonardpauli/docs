import {prisma} from './generated/prisma'

async function main() {
	const newUser = await prisma.createUser({name: 'Anna'})
	console.log(`created user ${newUser.name} (${newUser.id})`)

	const allUsers = await prisma.users()
	console.log(allUsers)

}

main().catch(console.error)
