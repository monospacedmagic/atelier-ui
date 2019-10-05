<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar class="amethyst-titlebar">
        <q-icon name="img:statics/editor_logo.svg" />
        <q-toolbar-title>
          Amethyst Editor
        </q-toolbar-title>
        <q-btn to="/playground">Playground</q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <keep-alive include="playground">
        <router-view />
      </keep-alive>
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
