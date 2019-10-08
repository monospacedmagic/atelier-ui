// The core folder is where we put the most generic components that are vital.
// Core
import ContentBrowser from 'components/core/ContentBrowser.vue'

// General components
import Tree from 'components/interface/Tree.vue'
import Assets from 'components/interface/Assets.vue'
import FileMenu from 'components/menu/FileMenu.vue'
import FileMenuSubMenu from 'components/menu/FileMenuSubMenu.vue'
import FileSelector from 'components/FileSelector.vue'
import NewProject from 'components/NewProject.vue'

export default async ({ Vue }) => {
  // Core
  Vue.component('ContentBrowser', ContentBrowser)
  // General, untagged.
  Vue.component('Tree', Tree)
  Vue.component('Assets', Assets)
  Vue.component('FileMenu', FileMenu)
  Vue.component('FileMenuSubMenu', FileMenuSubMenu)
  Vue.component('FileSelector', FileSelector)
  Vue.component('NewProject', NewProject)
}
