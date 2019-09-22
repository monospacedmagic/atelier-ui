import Tauri from '../statics/tauri'
const tauri = new Tauri()
import Vue from 'vue'

Vue.prototype.$tauri = tauri

export {
  tauri
}
