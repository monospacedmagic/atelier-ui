<script>
    export let pannel_name = 'New Pannel';
</script>

<div class="n_pannel">
    <p>{pannel_name}</p>
    <slot></slot>
</div>

<style>
    .n_pannel{
        padding: 5px;
    }
</style>