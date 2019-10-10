<template>
  <div class="editor-bg-primary full-height" style="overflow-y: hidden !important"
  >
    <q-bar dense class="editor-bg-secondary">
      <editor-tab-ball style="background-color: #C70000"/>
      <div>Entity settings</div>
      <q-space />
      <q-btn size="xs" flat icon-right="search" :label="filter" no-caps>
        <q-menu anchor="center middle" self="center middle" ref="popup" style="padding: 0 2px !important"
        >
          <q-input
            dense
            ref="filter"
            borderless
            v-model="filter"
            @keyup.enter="$refs.popup.hide()"
            style="padding: 0 2px!important"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
            </template>
          </q-input>
        </q-menu>

      </q-btn>
    </q-bar>
    <div>
      <q-scroll-area
        :style="`height: ${scrollHeight}px`"
        :thumb-style="{ right: '2px', borderRadius: '2px', background: 'black', width: '4px', opacity: 1 }"
      >

      </q-scroll-area>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Assets',
  props: {
    scrollHeight: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      search: false,
      filter: ''
    }
  },
  computed: {

  },
  methods: {
    myFilterMethod (node, filter) {
      const filt = filter.toLowerCase()
      return node.label && node.label.toLowerCase().indexOf(filt) > -1
    },
    resetFilter () {
      this.filter = ''
      this.$refs.filter.focus()
    }
  }
}
</script>
