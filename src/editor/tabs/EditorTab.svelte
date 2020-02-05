<script>
    import EditorButton from '../EditorButton.svelte'
    export let name;
</script>

<div class=tab>
    <p>icon</p>
    <p>{name}</p>
    <p> X </p>

    <EditorButton name="HEd" />
</div>

<style>
    tab{
        background-color: chartreuse;
        padding: 20px
    }
</style>