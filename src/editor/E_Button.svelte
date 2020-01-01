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
  color: #fff;
  background-color: #464646;
  border-radius: 3px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  -webkit-transition: 0.2s;
  margin: 2px;
  padding: 3px;
  border: solid rgb(94, 94, 94) 1px;
  outline: none;
}

button:hover {
  background-color: #636363;
}
button:active {
  background-color: #5a6881;
}
</style>