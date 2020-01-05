<script>
	import E_Button from './editor/E_Button.svelte'
	import E_Pannel from './editor/E_Pannel.svelte'
	import E_Input_Ranger from './editor/E_Input_Ranger.svelte'
	import E_App_Nav from './editor/E_App_Nav.svelte'
	import E_Dock from './editor/E_Dock.svelte'
	import SplitPane from './editor/E_Splitter.svelte';
	
	export let fixed = false;
	export let fixedPos = 50;
	export let orientation = 'columns';

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

	<SplitPane
		type="{orientation === 'rows' ? 'vertical' : 'horizontal'}"
		pos="{fixed ? fixedPos : orientation === 'rows' ? 50 : 60}"
		{fixed}
	>
		<section slot=a>
			<E_Dock />
		</section>

		<section slot=b style='height: 100%;'>
				<SplitPane
					type="{'rows' === 'rows' ? 'vertical' : 'horizontal'}"
					pos="{fixed ? fixedPos : orientation === 'rows' ? 50 : 60}"
					{fixed}
				>
					<section slot=a>
						<E_Dock />
					</section>

					<section slot=b style='height: 100%;'>
						<E_Dock />
					</section>
				</SplitPane>
		</section>
	</SplitPane>
</div>


<style>
	.editor-frame{
		margin: 0px;
		background-color: var(--background);
		height: 100%;
		color: #fff;
	}
</style>