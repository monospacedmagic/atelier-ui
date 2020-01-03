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
		height: 32px;
		display: flex;
		box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.37) !important;
		background-color: var(--surface);
    }
</style>