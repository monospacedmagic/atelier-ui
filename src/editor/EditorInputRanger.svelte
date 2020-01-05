<script>
    export let val_min = null;
    export let val_max = null;

    export let onclick;
    export let UpdateEvent;

</script>

<input type="number" min={val_min} max={val_max}>

<style>
input {
  display: block;
  background-color: #ffffff;
  border-radius: 5px;
  -webkit-box-shadow: rgba(0, 0, 0, 0.23) 0px 3px 8px;
          box-shadow: rgba(0, 0, 0, 0.23) 0px 3px 8px;
  -webkit-transition: 0.5s;
  transition: 0.5s;
  -webkit-transition: 0.2s;
  margin: 4px
}

input:hover {
  -webkit-box-shadow: rgba(0, 0, 0, 0.416) 0px 3px 9px;
          box-shadow: rgba(0, 0, 0, 0.416) 0px 3px 9px;
}
input:active {
  background-color: #faf5ff;
}
</style>