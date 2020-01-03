<script>
	import E_Button from './editor/E_Button.svelte'
	import E_Pannel from './editor/E_Pannel.svelte'
	import E_Input_Ranger from './editor/E_Input_Ranger.svelte'
	import E_App_Nav from './editor/E_App_Nav.svelte'
	import E_Dock from './editor/E_Dock.svelte'
	
	const test = () => {
		alert("test");
	};

	let filemenu = [
		{ lable: 'File' },
		{ lable: 'Edit' },
		{ lable: 'Settings' }
	];
</script>


<div class="editor-frame">
	<E_App_Nav entrys={filemenu} />
	<E_Dock />
</div>


<style>
	.editor-frame{
		margin: 0px;
		background-color: var(--background);
		height: 100%;
		color: #fff;
	}
</style>