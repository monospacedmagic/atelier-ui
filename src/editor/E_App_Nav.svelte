<script>
    import E_Button from './E_Button.svelte'

    let entrys = [
		{ lable: 'File' },
		{ lable: 'Edit' },
		{ lable: 'Settings' }
	];

</script>

<div class="app_nav red">
	{#each entrys as item}
		<E_Button name={item.lable} />
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