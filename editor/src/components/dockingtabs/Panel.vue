<template>
  <div>
    <h1>space</h1>
  </div>
</template>

<script>
export default {
  name: 'panel',
  props: {
    tabname: {
      type: String,
      default: 'tab'
    },
    colortag: {
      type: String,
      default: '#53DB61'
    }
  },
  data () {
    return {}
  },
  computed: {}
}
</script>
