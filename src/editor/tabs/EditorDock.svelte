<script>
    import tab from './EditorTab.svelte'
</script>

<div class=dock>
    <div class="app_nav">
        <tab name="hello" />
    </div>
    <h1>DOCK TABS HERE.</h1>
</div>

<style>
    .dock{
        width: 100%;
        height: 100%;
    }
    h1{
        text-align: center;
        vertical-align: middle;
        padding: 0px;
        margin: 0px;
    }
</style>