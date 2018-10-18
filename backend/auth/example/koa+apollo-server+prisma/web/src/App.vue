<template>
	<h1>Hello {{msg}}</h1>
</template>
<script>
import gql from 'graphql-tag'

export default {
	apollo: {
		msg: gql`query { msg: message }`, // field name has to match?
	},
}
</script>
