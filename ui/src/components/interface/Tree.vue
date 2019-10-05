<template>
  <div class="bg-blue-grey-2 full-height" style="overflow-y: hidden!important"
  >
    <q-bar dense class="bg-blue-grey-7">
      <q-icon name="account_tree" />
      <div>Assets</div>
      <q-space />
      <q-btn size="xs" flat color="blue-grey-3" icon-right="search" :label="filter" no-caps>
        <q-menu anchor="center middle" self="center middle" ref="popup"             style="padding: 0 2px!important"
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
        <q-tree class="col-12 col-sm-6"
                :nodes="simple"
                node-key="label"
                tick-strategy="leaf"
                :selected.sync="selected"
                :ticked.sync="ticked"
                :expanded.sync="expanded"
                :filter="filter"
                :filter-method="myFilterMethod"
                default-expand-all
                style="font-size:0.8em"
        >
          <template v-slot:header-adv="prop">
            <div class="row full-width">
              <div>
                {{ prop.node.label }}
              </div>
              <div class="absolute-right q-mr-sm">
                <q-btn size="xs" dense flat text-color="green-8" :icon="prop.node.visible ? 'visibility' : 'visibility_off'" uneleveated @click.native.stop @click="prop.node.visible = !prop.node.visible"></q-btn>
                <q-btn size="xs" dense flat text-color="red-8" icon="clear" uneleveated @click.native.stop></q-btn>
              </div>
            </div>
          </template>
        </q-tree>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    scrollHeight: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      search: false,
      simple: [ // this should be injected by the project
        {
          label: 'World',
          children: [
            {
              label: 'Actor',
              header: 'adv',
              visible: true,
              children: [
                { label: 'Head', header: 'adv', visible: true },
                { label: 'Feet', header: 'adv', visible: true },
                { label: 'Gun', header: 'adv', visible: true }
              ]
            },
            {
              label: 'Enemy',
              header: 'adv',
              visible: true,
              children: [
                { label: 'Head', header: 'adv', visible: true },
                { label: 'Feet', header: 'adv', visible: true }
              ]
            },
            {
              label: 'Weather',
              header: 'adv',
              visible: true,
              children: [
                { label: 'Sun', header: 'adv', visible: true },
                { label: 'Wind', header: 'adv', visible: true },
                { label: 'Snow', header: 'adv', visible: true }
              ]
            }
          ]
        }
      ],
      filter: '',
      selected: 'Pleasant surroundings',
      ticked: ['Quality ingredients', 'Good table presentation'],
      expanded: ['Satisfied customers', 'Good service (disabled node)', 'Pleasant surroundings']
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
