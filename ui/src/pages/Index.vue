<template>
  <q-page class="flex">
    <div class="col">
      <q-input class="col-12" label="Search folder..." v-model="path" outlined filled @keypress.enter="getFiles()">
        <template #append>
          <q-icon class="cursor-pointer" name="search" @click="getFiles()"/>
        </template>
      </q-input>

      <img :src="href" v-if="href">

      <div class="col-12">
        <q-list>
          <q-item v-for="file in files" :key="file.path" @click="onFileClick(file)" :clickable="!file.is_dir">
            <q-item-section>{{ `Path: ${file.path}` }}</q-item-section>
            <q-item-section>{{ `Name: ${file.name}` }}</q-item-section>
            <q-item-section>{{ `Type: ${file.is_dir ? 'dir' : 'file'}` }}</q-item-section>
          </q-item>
        </q-list>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  data () {
    return {
      files: [],
      path: './',
      href: null,
      hashTime: '',
      plugins: 'none found',
      localStore: 0
    }
  },
  mounted () {
    setTimeout(() => {
      this.$q.notify('Calling command...')
      window.tauri.execute('ls', ['-la'])
        .then(output => {
          this.$q.notify(output)
        })
        .catch(err => {
          this.$q.notify(`err ${err}`)
        })
    }, 100)
    // this.getFiles()
  }
  /*,
  methods: {
    getFiles () {
      window.Tauri.listFiles(this.path)
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
          promise = window.Tauri.readBinaryFile(file.path)
            .then(contents => {
              this.arrayBufferToBase64(new Uint8Array(contents), base64 => {
                this.href = 'data:image/png;base64,' + base64
              })
            })
        } else {
          promise = window.Tauri.readTextFile(file.path)
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
  */
}
</script>
