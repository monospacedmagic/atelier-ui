<script>
    import EditorButton from './EditorButton.svelte'

    export let entrys;

</script>

<div class="app_nav">
	{#each entrys as item}
		<EditorButton flat name={item.lable} />
	{/each}
</div>

<style>
	.app_nav{
		box-shadow: none;
	}
</style>