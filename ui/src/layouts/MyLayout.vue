<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="amethyst-titlebar">
        <q-icon name="img:statics/editor_logo.svg" />
        <q-toolbar-title>
          Amethyst Editor
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MyLayout',
  data () {
    return {
    }
  }
}
</script>
