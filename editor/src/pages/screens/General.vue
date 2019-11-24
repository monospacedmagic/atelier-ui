<template>
  <q-page class="full-width fixed">
    <div id="tools" class="absolute-left" style="width:70px;top:0px;bottom:0;left:0;z-index:1">
      <div class="flex flex-center">
        <div class="column text-center full-height">
          <q-fab class="q-mt-sm" flat icon="img:statics/logo-v2.png" direction="down" :persistent="fab.persist" v-model="fab.model">
            <q-fab-action color="secondary" icon="save">
              <q-tooltip transition-show="scale" transition-hide="scale" anchor="center right" self="center left">{{ $t('interface.fab.save') }}</q-tooltip>
            </q-fab-action>
            <q-fab-action color="secondary" icon="get_app">
              <q-tooltip transition-show="scale" transition-hide="scale" anchor="center right" self="center left">{{ $t('interface.fab.render') }}</q-tooltip>
            </q-fab-action>
            <q-fab-action color="secondary" icon="play_arrow">
              <q-tooltip transition-show="scale" transition-hide="scale" anchor="center right" self="center left">{{ $t('interface.fab.cargo') }}</q-tooltip>
            </q-fab-action>
          </q-fab>
        </div>
        <!--
        <div class="row q-mt-md q-py-lg bg-blue-grey-10">
            <q-btn class="q-ma-xs" size="sm" color="blue-grey-4" round icon="airplay"></q-btn>
            <q-btn class="q-ma-xs" size="sm" color="blue-grey-4" round icon="save"></q-btn>
            <q-btn class="q-ma-xs" size="sm" color="blue-grey-4" round icon="zoom_in"></q-btn>
            <q-btn class="q-ma-xs" size="sm" color="blue-grey-4" round icon="zoom_out"></q-btn>
            <q-btn class="q-ma-xs" size="sm" color="blue-grey-4" round icon="font_download"></q-btn>
            <q-btn class="q-ma-xs" size="sm" color="blue-grey-4" round icon="camera"></q-btn>
            <q-btn class="q-ma-xs" size="sm" color="blue-grey-4" round icon="undo"></q-btn>
            <q-btn class="q-ma-xs" size="sm" color="blue-grey-4" round icon="redo"></q-btn>
        </div>
        -->
      </div>
      <div id="version" class="fixed-bottom-left text-center text-primary" style="width:70px">
        <small>v{{version}}</small>
      </div>
    </div>
    <q-splitter
      class="absolute-right"
      v-model="splitterModel"
      style="height: calc(100vh - 50px);width:calc(100% - 70px)"
    >

      <template v-slot:after>
        <q-splitter
          v-model="sidebarModel"
          horizontal
          @input="e => resizeScroll(e)"
          id="treeContainer"
        >
          <template v-slot:before id="tree">
            <div class="full-height bg-blue-grey-2">
              <Tree :scroll-height="scrollBarTopHeight" />
            </div>
          </template>

          <template v-slot:after>
            <div class="full-height bg-blue-grey-2">
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
            <q-bar dense class="bg-blue-grey-7">
              <q-icon name="format_paint" />
              <div>Canvas</div>
              <q-space />
              <q-btn-group size="xs" class="float-right" dense flat>
                <q-btn color="blue-grey-8" icon="skip_previous"></q-btn>
                <q-btn color="blue-grey-8" icon="fast_rewind"></q-btn>
                <q-btn color="blue-grey-8" icon="pause"></q-btn>
                <q-btn color="blue-grey-8" icon="play_arrow"></q-btn>
                <q-btn color="blue-grey-8" icon="fast_forward"></q-btn>
                <q-btn color="blue-grey-8" icon="skip_next"></q-btn>
              </q-btn-group>
            </q-bar>
            <div class="q-pa-md bg-blue-grey-4">
              <div class="full-width full-height bg-blue-grey-4">
                <canvas id="mainCanvas" height="100%" width="100%"></canvas>
              </div>
            </div>
          </template>

          <template v-slot:after>
            <q-bar dense class="bg-blue-grey-7">
              <q-icon name="laptop_chromebook" />
              <div>Console</div>
            </q-bar>
            <q-input dense v-model="cmd" value="Enter Cmd" class="q-py-md"></q-input>
          </template>

        </q-splitter>
      </template>
    </q-splitter>
    <div class="q-pa-xs fixed-bottom full-width bg-red">
      <div style="margin-left:85px;font-size:0.8em;height:14px">
        : {{ status }}
      </div>
    </div>
  </q-page>
</template>

<script>
import tauri from '../../statics/tauri'
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
      status: '(error): Amethyst.toml not found.',
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
