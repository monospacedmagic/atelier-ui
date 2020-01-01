<script>
	import E_Button from './editor/E_Button.svelte'
	import E_Pannel from './editor/E_Pannel.svelte'
	import E_Input_Ranger from './editor/E_Input_Ranger.svelte'
	import E_App_Nav from './editor/E_App_Nav.svelte'
	
	const test = () => {
		alert("test");
	};
</script>

<E_App_Nav />
<div class="editor-frame testcolor">
	<h1>Hello, Amethyst!</h1>
	<E_Pannel>
		<E_Button name='This is a nice button' onclick={test} />
		<E_Button onclick={test} />
		<E_Input_Ranger />
	</E_Pannel>
</div>

<style>
	.editor-frame{
		margin: 0px;
		padding: 10px;
		background-color: rgb(48, 48, 48);
		height: 100%;
		color: #fff;
	}
</style>