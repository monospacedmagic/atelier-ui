<template>
<div>
<q-bar dense class="editor-bg-secondary" style="padding:0px">
  <q-btn no-caps :ripple="false" unelevated outline color="$editor-font-primary" flat class="row" style="border-radius:0px;padding: 0px 0px 0px 5px">
    <img src="/statics/editorball.svg" style="fill:$editor-font-primary">
    <div style="padding-left:4px;font-size:14px">Entity settings</div>
    <q-btn round flat icon="close"/>
  </q-btn>
</q-bar>
  <div style="padding:20px">
  </div>
</div>
</template>
<script>
export default {
  name: 'Dock',
  props: {},
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
