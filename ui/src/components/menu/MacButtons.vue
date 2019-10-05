<template>
  <div style="margin: 7px 10px 0 -3px;z-index:1000" @mouseover="hover = '_hover'" @mouseleave="winFocus ? hover = '' : hover = '_grey'">
    <img class="macButton" draggable="false" :src="`statics/macButtons/red${hover}.png`" @click.native="closeApp" :style="`opacity:${rDim}`" @mousedown="rDim = 0.5" @mouseup="rDim = 1" @mouseleave="rDim = 1" />
    <img class="macButton" draggable="false" :src="`statics/macButtons/yellow${hover}.png`" :style="`opacity:${yDim}`" @mousedown="yDim = 0.5" @mouseup="yDim = 1" @mouseleave="yDim = 1" />
    <img class="macButton" draggable="false" :src="`statics/macButtons/green${hover}.png`" @click.native="maximizeApp" :style="`opacity:${gDim}`" @mousedown="gDim = 0.5" @mouseup="gDim = 1" @mouseleave="gDim = 1" />
  </div>
</template>
<script>
export default {
  name: 'MacButtons',
  data () {
    return {
      winFocus: false,
      rDim: 1,
      yDim: 1,
      gDim: 1,
      hover: ''
    }
  },
  mounted () {
    window.addEventListener('focus', () => {
      this.hover = ''
      this.winFocus = true
    })
    window.addEventListener('blur', () => {
      this.hover = '_grey'
      this.winFocus = false
    })
  },
  destroyed () {
    window.removeEventListener('focus')
    window.removeEventListener('blur')
  }
}
</script>
<style lang="stylus">
body
  -webkit-user-select none
  -webkit-app-region drag
  .tauri-drag--exception
    -webkit-app-region no-drag
.macButton
  height 22px
  width 22px
  margin-left -2px
  user-select none
</style>
