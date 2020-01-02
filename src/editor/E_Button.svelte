<script>
    export let flat = false;
    export let name = 'button';
    
    export let onclick;
</script>

<button on:click={onclick} class:flat >
  {name}
</button>

<style>
  .flat{
    background-color: var(--surface) !important;
    border-radius: 0px;
    color: #fff
  }

  button {
    display: flex;
    border: 0;
    color: var(--on-primary);
    background-color: var(--primary);
    border-radius: 3px;
    -webkit-transition: 0.5s;
    transition: 0.5s;
    -webkit-transition: 0.2s;
    margin: 0px;
    padding: auto 20px;
    border: none;
    outline: none;
  }

  button:hover {
    filter: brightness(1.5);
  }
  button:active {
    filter: brightness(0.7);
  }
</style>