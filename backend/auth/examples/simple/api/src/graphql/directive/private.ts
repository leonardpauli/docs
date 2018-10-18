import { SchemaDirectiveVisitor } from 'apollo-server-koa'
import { GraphQLField, GraphQLEnumValue, getNullableType } from "graphql";

// directive @private on FIELD_DEFINITION

export default class PrivateDirective extends SchemaDirectiveVisitor {

	public visitFieldDefinition(field: GraphQLField<any, any>) {
		field.isDeprecated = true
		field.deprecationReason = 'private'
		field.type = getNullableType(field.type);
		field.resolve = async ()=> null
	}

	public visitEnumValue(value: GraphQLEnumValue) {
		value.isDeprecated = true
		value.deprecationReason = 'private'
	}

}
