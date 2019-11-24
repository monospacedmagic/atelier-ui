<template>
  <q-page class="full-width fixed">
    <div class="q-pa-xs fixed-top full-width editor-bg-primary">
      <div class="row" style="font-size:0.8em;height:24px">
        <img src="/statics/editor_logo.svg" class="noselect editor_window_logo">
        <FileMenu class="col self-start noselect" style="padding-left:5px"></FileMenu>
        <p class="col-2 self-center editor-title" >{{project_name}} | Editor</p>
        <div class="col justify-end">
        <q-btn-dropdown split flat color="grey-9 " icon="bug_report" label="Debug" style=" transform: translateY(-6px) scale(0.7)">
          <q-list>
            <q-item icon="bug_report" clickable v-close-popup @click="triggerAssets">
              <q-item-section>
                <q-item-label icon="bug_report">Release</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn @click="triggerAssets" flat color="grey-9 " icon="track_changes" label="Start asset system." style=" transform: translateY(-6px) scale(0.7)" />
        </div>
      </div>
    </div>
    <q-splitter
      class="absolute-right"
      v-model="splitterModel"
      style="top: 32px;height:calc(100% - 54px);width:calc(100%)"
    >
      <template v-slot:after>
        <q-splitter
          v-model="sidebarModel"
          horizontal
          @input="e => resizeScroll(e)"
          id="treeContainer"
        >
          <template v-slot:before id="tree">
            <div class="full-height editor-bg-secondary">
              <Tree :scroll-height="scrollBarTopHeight" />
            </div>
          </template>
          <template v-slot:after>
            <div class="full-height editor-bg-secondary">
              <Assets :scroll-height="scrollBarBottomHeight" />
            </div>
          </template>
        </q-splitter>
      </template>
      <template v-slot:before>
        <q-splitter
          v-model="insideModel"
          horizontal
        >
          <template v-slot:before>
            <q-bar dense class="editor-bg-secondary">
              <img src="/statics/editorball.svg" style="fill:#53DB61">
              <div>Canvas</div>
              <q-space />
            </q-bar>
            <div class="q-pa-md editor-bg-primary">
              <div class="full-width full-height editor-bg-primary">
                <canvas id="mainCanvas" height="100%" width="100%"></canvas>
              </div>
            </div>
          </template>
          <template v-slot:after>
            <q-bar dense class=" editor-bg-secondary">
              <img src="/statics/editorball.svg" style="fill:#53DB61">

              </q-bar>
           </template>
        </q-splitter>
      </template>
    </q-splitter>
    <div class="q-pa-xs fixed-bottom full-width editor-bg-secondary">
      <div style="margin-left:4px;font-size:0.8em;height:14px;">
        : {{ status }}
      </div>
    </div>
  </q-page>
</template>

<script>
import tauri from '../statics/tauri'
const version = require('app/package.json').version

document.addEventListener('DOMContentLoaded', function () {
  tauri.invoke({ cmd: 'init' })
})

export default {
  name: 'General',
  data () {
    return {
      version: version,
      cmd: '',
      fab: {
        persist: true,
        model: ''
      },
      status: '[error]: Amethyst.toml project has not been found.',
      project_name: 'Editor Pong!',
      splitterModel: 70,
      sidebarModel: 70,
      insideModel: 80,
      scrollBarTopHeight: 200,
      scrollBarBottomHeight: 200,
      entry: 'Don\'t be eval',
      sendEvt: false
    }
  },
  mounted () {
    this.resizeScroll(this.sidebarModel)
    tauri.addEventListener('reply', res => {
      // console.table(res)
      this.entry = res.payload.msg
      alert(res.payload.msg)
      this.sendEvt = false
    }, true)
    /* SMOKE TEST
    setTimeout(() => {
      this.$q.notify('Calling command...')
      tauri.execute('ls', ['-la'])
        .then(output => {
          this.$q.notify(output)
        })
        .catch(err => {
          this.$q.notify(`err ${err}`)
        })
    }, 100)
    this.getFiles()
   */
  },
  methods: {
    triggerAssets () {
      tauri.invoke({ cmd: 'emit', event: 'hello', payload: this.entry })
      tauri.addEventListener('reply', res => {
        // console.table(res)
        this.entry = res.payload.msg
        alert(res.payload.msg)
        this.sendEvt = false
      }, true)
      // tauri.emit('hello', this.entry)
      // tauri.emit is shorthand for: tauri.invoke({ cmd: 'emit', event: 'hello', payload: this.entry })
    },
    arrayBufferToBase64 (buffer, callback) {
      var blob = new Blob([buffer], { type: 'application/octet-binary' })
      var reader = new FileReader()
      reader.onload = function (evt) {
        var dataurl = evt.target.result
        callback(dataurl.substr(dataurl.indexOf(',') + 1))
      }
      reader.readAsDataURL(blob)
    },
    resizeScroll (size) {
      const h = document.getElementById('treeContainer').getBoundingClientRect()
      this.scrollBarTopHeight = (h.bottom - h.top) * (size / 100) - 30
      this.scrollBarBottomHeight = h.bottom - h.top - this.scrollBarTopHeight
    }
  }
}
</script>
<style lang="stylus">
.q-splitter__before, .q-splitter__after, body
  overflow hidden!important
#tools
  background-color $tertiary
.q-fab--opened
  background-image url(/statics/logo-v2.png)!important
  background-size cover
  animation-name fadeIn
  animation-duration 500ms
  opacity
  i:first-of-type
    color #fff
    font-size 2em

@keyframes fadeIn
  0%
    opacity 1
  50%
    opacity 0.5
  100%
    opacity 1

</style>
