<template>
  <q-page class="flex flex-center">
    <q-card class="welcome-card">
      <q-card-section>
        <div class="text-h6">Welcome!</div>
      </q-card-section>
      <q-card-section>
        {{ welcometext }}
      </q-card-section>
      <br>
      <q-card-section>
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Recent projects</th>
              <th class="text-right">Amethyst version</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left .text-subtitle2">Frozen Yogurt
                <div class="text-caption">Path: C:/foo/bar/</div>
              </td>
              <td class="text-right">0.14</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <br>
      <q-separator inset />
      <q-card-actions align="right">
        <FileSelector class="q-ma-md"></FileSelector>
        <NewProject class="q-ma-md"></NewProject>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import tauri from '../statics/tauri'

export default {
  name: 'PageIndex',
  data () {
    return {
      welcometext: 'There is currently no project open! Either create a new one, or open a existing.',
      files: [],
      path: './',
      href: null,
      hashTime: '',
      plugins: 'none found',
      localStore: 0
    }
  },
  mounted () {
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
    }
  }
}
</script>
