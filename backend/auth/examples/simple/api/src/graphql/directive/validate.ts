import { SchemaDirectiveVisitor } from 'apollo-server-koa'
import { GraphQLField, GraphQLEnumValue } from "graphql";

// directive @validate(type: String) on FIELD_DEFINITION

export default class ValidateDirective extends SchemaDirectiveVisitor {

	public visitFieldDefinition(field: GraphQLField<any, any>) {
		field;
	}

	public visitEnumValue(value: GraphQLEnumValue) {
		value;
	}

}
