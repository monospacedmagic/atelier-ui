<script>
    import E_Button from './E_Button.svelte'

    export let entrys;

</script>

<div class="app_nav">
	{#each entrys as item}
		<E_Button flat name={item.lable} />
	{/each}
</div>

<style>
    .app_nav{
		width: 100%;
		height: 30px;
		display: flex;
		background-color: var(--surface);
    }
</style>