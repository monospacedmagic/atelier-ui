<template>
  <q-menu
    v-model="menu.open"
    @input="$emit('menuToggle', menu)"
    :content-class="[{ 'selected-menu': menu.open}, 'menu-item-list']"
  >
    <q-list class="bg-grey-1" dense>
      <q-item
        v-for="childMenu in menu.children"
        :key="childMenu.shortcutKey"
        clickable
      >

        <q-item-section side style="margin-left:-2px;maxi-width:30px;width:30px">
          <q-icon v-if="childMenu.icon" :name="childMenu.icon" />
        </q-item-section>

        <q-item-section
          @click.native="clickMenuItem(childMenu)"
        >
          <div style="margin-left:-15px">
            <u>{{childMenu.name[0]}}</u>{{childMenu.name.substring(1)}}
          </div>
        </q-item-section>

        <q-item-section v-if="hasChildren(childMenu)" side>
          <q-icon name="keyboard_arrow_right" />
        </q-item-section>

        <file-menu-sub-menu v-if="hasChildren(childMenu)" :menu="childMenu" @menuToggle="$emit('menuToggle', childMenu)" />
      </q-item>
    </q-list>
  </q-menu>
</template>

<script>
export default {
  name: 'FileMenuSubMenu',
  props: {
    menu: {
      required: true,
      type: Object
    }
  },
  inject: ['handleMenuItemClick'],
  methods: {
    hasChildren (menu) {
      return menu.children && menu.children.length > 0
    },
    clickMenuItem (menu) {
      this.handleMenuItemClick(menu)
    }
  }
}
</script>

<style lang="stylus">
  .menu-item-list
    .q-icon
      width 0em
      font-size 1em
</style>
