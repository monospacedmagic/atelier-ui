<template>
  <q-page class="full-width fixed">
    <div class="q-pa-xs fixed-top full-width editor-bg-primary">
      <div class="row" style="font-size:0.8em;height:24px">

        <img src="/statics/editor_logo.svg" class="editor_window_logo">

        <FileMenu style="padding-left:5px"></FileMenu>

        <q-btn-dropdown split flat color="grey-9 " icon="bug_report" label="Debug" style=" transform: translateY(-6px) translateX(-22px) scale(0.7)">
          <q-list>
            <q-item icon="bug_report" clickable v-close-popup @click="onItemClick">
              <q-item-section>
                <q-item-label icon="bug_report">Release</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
              <editor-tab-ball style="background-color: #00C7AF"/>
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
            <q-bar dense class="editor-bg-secondary">
              <editor-tab-ball style="background-color: #DB53CD"/>
              <div>Console</div>
            </q-bar>
            <q-input dense v-model="cmd" value="Enter Cmd" class="q-py-md"></q-input>
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
      splitterModel: 70,
      sidebarModel: 70,
      insideModel: 80,
      scrollBarTopHeight: 200,
      scrollBarBottomHeight: 200
    }
  },
  mounted () {
    this.resizeScroll(this.sidebarModel)
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
    getFiles () {
      tauri.listFiles(this.path)
        .then(files => {
          this.files = files
        })
        .catch(err => {
          this.files = []
          this.$q.notify(err)
        })
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
    onFileClick (file) {
      if (file.is_dir) {
        this.$q.notify('Dir click not implemented')
      } else {
        let promise
        if (file.path.includes('.png') || file.path.includes('.jpg')) {
          promise = tauri.readBinaryFile(file.path)
            .then(contents => {
              this.arrayBufferToBase64(new Uint8Array(contents), base64 => {
                this.href = 'data:image/png;base64,' + base64
              })
            })
        } else {
          promise = tauri.readTextFile(file.path)
            .then(contents => {
              this.$q.dialog({
                title: file.path,
                message: contents
              })
            })
        }
        promise.catch(err => this.$q.notify(err))
      }
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
