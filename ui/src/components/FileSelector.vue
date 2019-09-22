<template>
  <div>
    <q-window
      ref="window"
      v-model="visible"
      title="Project Selector"
      :height="150"
      :width="350"
      :actions="['embedded', 'pin', 'maximize', 'fullscreen', 'close']"
      float
      content-class="bg-grey-1"
      @visible="(v) => visible = v"
    >
      <div class="q-pa-md fit">
        This is the "default" slot content
      </div>
    </q-window>
    <q-btn
      v-if="canShowButton === true"
      label="Show Window"
      color="primary"
      @click="visible = true"
      style="width: 100%;"
    />
  </div>
</template>

<script>
export default {
  name: 'FileSelector',
  props: {
    visible: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    canShowButton () {
      return this.visible !== true
    }
  }
}
</script>
