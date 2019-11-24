<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
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
