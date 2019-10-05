import FileSelector from 'components/FileSelector.vue'
import NewProject from 'components/NewProject.vue'

export default async ({ Vue }) => {
  Vue.component('FileSelector', FileSelector)
  Vue.component('NewProject', NewProject)
}
