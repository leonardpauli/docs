import { SchemaDirectiveVisitor } from 'apollo-server'

export default class IntlDirective extends SchemaDirectiveVisitor {
	type FTranlate = (defaultText: string, path: string[], locale: string)=> string
	constructor (public translate: FTranlate = d=> d) { super() }
	visitFieldDefinition(field, details) {
		const { resolve = defaultFieldResolver } = field
		field.resolve = async function (...args) {
			const context = args[2]
			const defaultText = await resolve.apply(this, args)
			const path = [details.objectType.name, field.name]
			return translate(defaultText, path, context.locale)
		}
	}
}
