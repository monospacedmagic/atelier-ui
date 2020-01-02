<script>
	import E_Button from './editor/E_Button.svelte'
	import E_Pannel from './editor/E_Pannel.svelte'
	import E_Input_Ranger from './editor/E_Input_Ranger.svelte'
	import E_App_Nav from './editor/E_App_Nav.svelte'
	
	const test = () => {
		alert("test");
	};

	let filemenu = [
		{ lable: 'File' },
		{ lable: 'Edit' },
		{ lable: 'Settings' }
	];
</script>


<E_App_Nav entrys={filemenu} />
<div class="editor-frame testcolor">
</div>


<style>
	.editor-frame{
		margin: 0px;
		padding: 10px;
		background-color: var(--background);
		height: 100%;
		color: #fff;
	}
</style>