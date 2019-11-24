<template>
  <div>
    <q-window
      ref="window"
      v-model="visible"
      title="New Amethyst Project"
      :actions="['close']"
      fullscreen
      hide-grippers
      content-class="bg-grey-1"
      @visible="(v) => visible = v"
    >
      <div class="q-pa-md fit">
        <div class="col">
          <q-input class="col-12" label="Search folder..." v-model="path" outlined filled @keypress.enter="getFiles()">
            <template #append>
              <q-icon class="cursor-pointer" name="search" @click="getFiles()"/>
            </template>
          </q-input>

          <img :src="href" v-if="href">

          <div class="col-12">
            <q-list>
              <q-item dense v-for="file in files" :key="file.path" @click="onFileClick(file)" :clickable="!file.is_dir">
                <q-item-section>{{ `Path: ${file.path}` }}</q-item-section>
                <q-item-section>{{ `Name: ${file.name}` }}</q-item-section>
                <q-item-section>{{ `Type: ${file.is_dir ? 'dir' : 'file'}` }}</q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </div>
    </q-window>
    <q-btn
      v-if="canShowButton === true"
      label="Create new project"
      color="primary"
      @click="visible = true"
      style="width: 100%;"
    />
  </div>
</template>

<script>
import tauri from '../statics/tauri'
document.addEventListener('DOMContentLoaded', function () {
  tauri.invoke({ cmd: 'init' })
})
export default {
  name: 'NewProject',

  data () {
    return {
      visible: false,
      files: [],
      path: './',
      href: null,
      hashTime: '',
      plugins: 'none found',
      localStore: 0
    }
  },
  computed: {
    canShowButton () {
      return this.visible !== true
    }
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
        if (file.path.includes('Amethyst.toml')) {
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
    }
  }
}
</script>
