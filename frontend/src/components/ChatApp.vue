<template>
	<div>
		<div v-for="message in messages">
			{{ message }}
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {
			messages: ['one', 'two']
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
