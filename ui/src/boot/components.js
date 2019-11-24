// The core folder is where we put the most generic components that are vital.
// Core
import ContentBrowser from 'components/core/ContentBrowser.vue'

// Docking
import Dock from 'components/dockingtabs/Dock.vue'
import Panel from 'components/dockingtabs/Panel.vue'

// General components
import Tree from 'components/interface/Tree.vue'
import Assets from 'components/interface/Assets.vue'
import FileMenu from 'components/menu/FileMenu.vue'
import FileMenuSubMenu from 'components/menu/FileMenuSubMenu.vue'

export default async ({ Vue }) => {
  // Core
  Vue.component('ContentBrowser', ContentBrowser)
  // Docking
  Vue.component('Dock', Dock)
  Vue.component('Panel', Panel)
  // General, untagged.
  Vue.component('Tree', Tree)
  Vue.component('Assets', Assets)
  Vue.component('FileMenu', FileMenu)
  Vue.component('FileMenuSubMenu', FileMenuSubMenu)
}
