<script>
  import EditorButton from './editor/EditorButton.svelte';
  import EditorPannel from './editor/EditorPannel.svelte';
  import EditorInputRanger from './editor/EditorInputRanger.svelte';
  import EditorAppNav from './editor/EditorAppNav.svelte';
  import EditorDock from './editor/tabs/EditorDock.svelte';
  import EditorSpliter from './editor/EditorSplitter.svelte';

  export let fixed = false;
  export let fixedPos = 50;
  export let orientation = 'columns';

  const test = () => {
    alert('test');
  };

  let filemenu = [{ lable: 'File' }, { lable: 'Edit' }, { lable: 'Settings' }];
</script>

<style>
  .editor-frame {
    margin: 0px;
    background-color: var(--background);
    height: 100%;
    color: #fff;
  }
</style>

<div class="editor-frame">
  <EditorAppNav entrys={filemenu} />

  <EditorSpliter
    type={orientation === 'rows' ? 'vertical' : 'horizontal'}
    pos={fixed ? fixedPos : orientation === 'rows' ? 50 : 60}
    {fixed}>
    <section slot="a">
      <EditorDock />
    </section>

    <section slot="b" style="height: 100%;">
      <EditorSpliter
        type={'rows' === 'rows' ? 'vertical' : 'horizontal'}
        pos={fixed ? fixedPos : orientation === 'rows' ? 50 : 60}
        {fixed}>
        <section slot="a">
          <EditorDock />
        </section>

        <section slot="b" style="height: 100%;">
          <EditorDock />
        </section>
      </EditorSpliter>
    </section>
  </EditorSpliter>
</div>
