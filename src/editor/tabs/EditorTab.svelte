<script>
  import EditorButton from '../EditorButton.svelte';
  export let name;
</script>

<style>
  tab {
    background-color: chartreuse;
    padding: 20px;
  }
</style>

<div class="tab">
  <p>icon</p>
  <p>{name}</p>
  <p>X</p>

  <EditorButton name="HEd" />
</div>
