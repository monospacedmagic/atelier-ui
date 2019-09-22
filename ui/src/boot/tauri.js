import Tauri from '../../src-tauri/tauri'
import Vue from 'vue'

const tauri = new Tauri()

Vue.prototype.$tauri = tauri
