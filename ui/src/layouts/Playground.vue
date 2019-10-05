<template>
  <q-layout view="lHh Lpr lFf">
    <q-bar id="toolbar" dense dark class="text-white row">
      <div class="text-weight-bold absolute-top full-width text-center relative-position tauri-drag" style="margin-top:1px">
        <span class="tauri-drag">Amethyst | {{ title }}</span>
      </div>
      <MacButtons v-if="$q.platform.is.mac"></MacButtons>
      <file-menu style="z-index:10"/>
      <q-space></q-space>
      <q-btn v-if="!$q.platform.is.mac" dense flat :icon="icons.onTop" @click.native="onTopApp" />
      <q-btn v-if="!$q.platform.is.mac" dense flat :icon="icons.maximize" @click.native="maximizeApp" />
      <q-btn v-if="!$q.platform.is.mac" dense flat icon="close" @click.native="closeApp" />
    </q-bar>
    <q-page-container>
      <keep-alive include="playground">
        <router-view />
      </keep-alive>
    </q-page-container>
  </q-layout>
</template>

<script>
import MacButtons from '../components/menu/MacButtons'
export default {
  name: 'PlaygroundLayout',
  components: { MacButtons },
  data () {
    return {
      project: 'Amethyst Editor',
      title: 'Demo'
    }
  }
}
</script>
<style lang="stylus">
#toolbar
  background $bggradient
.tauri-drag
  -webkit-user-select none
  -webkit-app-region drag
  cursor move
.tauri-drag--exception
  -webkit-app-region no-drag
</style>
