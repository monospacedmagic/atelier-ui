<template>
  <div class="row q-electron-drag--exception">
    <div
      v-for="menu in menu.children"
      :key="menu.shortcutKey"
      :class="[{ 'selected-menu': menu.open}, 'file-menu cursor-pointer non-selectable q-pl-xs q-pr-xs menu-item']"
      @mouseover="onMouseOverMenu(menu)"
      :ref="menu.name"
    >
      {{menu.name}}
      <file-menu-sub-menu
        :menu="menu"
        @menuToggle="handleMenuItemClick"
        top-level
      />
    </div>
  </div>
</template>

<script>
import { openURL } from 'quasar'
// stub remote for now
const remote = function () {}

export default {
  name: 'FileMenu',
  data () {
    return {
      selectedMenuItem: null,
      menu: {
        name: 'root',
        shortcutKey: 'altKey',
        children: [
          {
            name: 'File',
            open: false,
            shortcutKey: 'f',
            children: [
              {
                name: 'New Project',
                open: false,
                shortcutKey: 'n',
                action: this.onFileExitClick,
                icon: 'fas fa-folder-plus'
              },
              {
                name: 'Open Project',
                open: false,
                shortcutKey: 'o',
                action: this.onFileExitClick,
                icon: 'fas fa-folder-open'
              },
              {
                name: 'Save Project',
                open: false,
                shortcutKey: 's',
                action: this.onFileExitClick,
                icon: 'fas fa-save'
              },
              {
                name: 'Exit',
                open: false,
                shortcutKey: 'e',
                action: this.onFileExitClick,
                icon: 'fas fa-sign-out-alt'
              }
            ]
          },
          {
            name: 'Edit',
            open: false,
            shortcutKey: 'e',
            children: [
              {
                name: 'Cut',
                open: false,
                shortcutKey: 't',
                icon: 'fas fa-copy'
              },
              {
                name: 'Copy',
                open: false,
                shortcutKey: 'o',
                icon: 'fas fa-paste'
              },
              {
                name: 'Paste',
                open: false,
                shortcutKey: 'p',
                icon: 'fas fa-clipboard'
              }
            ]
          },
          {
            name: 'Window',
            open: false,
            shortcutKey: 'w',
            children: [
              {
                name: 'Layout',
                open: false,
                shortcutKey: 'l',
                action: this.onTopApp
              },
              {
                name: 'Float',
                open: false,
                shortcutKey: 'f',
                action: this.onTopApp
              },
              {
                name: 'Maximise',
                open: false,
                shortcutKey: 'm',
                action: this.maximizeApp
              }
            ]
          },
          {
            name: 'Settings',
            open: false,
            shortcutKey: 's',
            children: [
              {
                name: 'System',
                open: false,
                shortcutKey: 's',
                action: this.maximizeApp,
                icon: 'fas fa-cog'
              },
              {
                name: 'Project',
                open: false,
                shortcutKey: 'p',
                action: this.maximizeApp,
                icon: 'fas fa-sliders-h'
              }
            ]
          },
          {
            name: 'Help',
            open: false,
            shortcutKey: 'h',
            children: [
              {
                name: 'Documentation',
                open: false,
                shortcutKey: 'd',
                action: '',
                icon: 'fas fa-book'
              },
              {
                name: 'Github',
                open: false,
                shortcutKey: 'w',
                action: 'https://github.com/amethyst/atelier-editor',
                icon: 'fab fa-github'

              },
              {
                name: 'Check for Updates',
                open: false,
                shortcutKey: 'c',
                icon: 'fas fa-plus-circle'
              },
              {
                name: 'About',
                open: false,
                shortcutKey: 'a',
                icon: 'fas fa-barcode'
              }
            ]
          }
        ]
      }
    }
  },
  components: {
    fileMenuSubMenu: () => import('./FileMenuSubMenu.vue')
  },
  provide: function () {
    return {
      handleMenuItemClick: this.handleMenuItemClick
    }
  },
  methods: {
    handleKeyUp (e) {
      if (!e[this.menu.shortcutKey]) {
        this.closeAllMenus(this.menu)
        this.selectedMenuItem = null
      }
    },
    closeAllMenus (menu) {
      for (let menuItem of menu.children) {
        menuItem.open = false
        if (menuItem.children) {
          this.closeAllMenus(menuItem)
        }
      }
    },
    handleKeyDown (e) {
      if (e[this.menu.shortcutKey]) {
        this.selectedMenuItem = this.getAndOpenMenu(this.selectedMenuItem, e.key)
        this.handleMenuItemClick(this.selectedMenuItem)
      }
    },
    getAndOpenMenu (menu, key) {
      if (menu === null) menu = this.menu
      if (!menu.children) return menu

      for (let childMenu of menu.children) {
        if (childMenu.shortcutKey === key) {
          menu.open = true
          childMenu.open = true
          return childMenu
        }
      }
      return menu
    },
    handleMenuItemClick (menuItem) {
      this.selectedMenuItem = menuItem.open ? menuItem : null
      if (menuItem.action) {
        const actionType = typeof menuItem.action
        switch (actionType) {
          case 'function': return menuItem.action()
          case 'string': return this.openLink(menuItem.action)
        }
      }

      if (menuItem.name) {
        this.$root.$emit(`menu.item.click.${menuItem.name.toLowerCase()}`)
      }
    },
    openLink (url) {
      openURL(url)
    },
    onFileExitClick () {
      remote.getCurrentWindow().close()
    },
    maximizeApp () {
      if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize()
      } else {
        remote.getCurrentWindow().maximize()
      }
    },
    onTopApp () {
      if (remote.getCurrentWindow().isAlwaysOnTop()) {
        remote.getCurrentWindow().setAlwaysOnTop(false)
      } else {
        remote.getCurrentWindow().setAlwaysOnTop(true, 'floating')
      }
    },
    onMouseOverMenu (menuItem) {
      if (this.selectedMenuItem) {
        this.closeAllMenus(this.menu)
        menuItem.open = true
      }
    }
  },
  created () {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }
}
</script>

<style lang="stylus">
  .menu-item-list
    border-radius 0 0 3px 3px !important
    box-shadow none !important
    min-width 125px
    border 2px solid $grey-6 !important

  .menu-item
    padding-right 10px

  .selected-menu
    background-color $grey-6 !important
    color black
</style>
