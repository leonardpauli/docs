import { SchemaDirectiveVisitor } from 'apollo-server-koa'
import { GraphQLField, GraphQLEnumValue } from "graphql";

const getMock = ()=> class MockDirective extends SchemaDirectiveVisitor {
	public visitFieldDefinition(field: GraphQLField<any, any>) { field; }
	public visitEnumValue(value: GraphQLEnumValue) { value; }
}

export default {
	default: getMock(),
	unique: getMock(),
}
