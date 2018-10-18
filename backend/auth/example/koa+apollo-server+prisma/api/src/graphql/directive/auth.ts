import { SchemaDirectiveVisitor } from 'apollo-server-koa'
import { GraphQLField, GraphQLEnumValue } from 'graphql'

// directive @auth(value: String) on FIELD_DEFINITION

export default class AuthDirective extends SchemaDirectiveVisitor {

	public visitFieldDefinition(field: GraphQLField<any, any>) {
		field;
	}

	public visitEnumValue(value: GraphQLEnumValue) {
		value;
	}

}
