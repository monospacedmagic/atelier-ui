<script>
    export let name = 'button';

    export let onclick;
</script>

<button on:click={onclick}>
  {name}
</button>

<style>
button {
  display: flex;
  color: var(--on-primary);
  background-color: var(--primary);
  border-radius: 3px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  -webkit-transition: 0.2s;
  margin: 2px;
  padding: 5px;
  border: none;
  outline: none;
}

button:hover {
  filter: brightness(1.15);
}
button:active {
  filter: brightness(0.7);
}
</style>