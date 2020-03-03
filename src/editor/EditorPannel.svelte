<script>
  export let pannel_name = 'New Pannel';
</script>

<style>
  .n_pannel {
    padding: 5px;
  }
</style>

<div class="n_pannel">
  <p>{pannel_name}</p>
  <slot />
</div>
