<template>
  <q-page class="flex flex-center">
    <q-card class="welcome-card">
      <q-card-section>
        <div class="text-h6">Welcome!</div>
      </q-card-section>
      <q-card-section>
        {{ welcometext }}
      </q-card-section>
      <br>
      <q-card-section>
        <q-markup-table>
          <thead>
            <tr>
              <th class="text-left">Recent projects</th>
              <th class="text-right">Amethyst version</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-left .text-subtitle2">Frozen Yogurt
                <div class="text-caption">Path: C:/foo/bar/</div>
              </td>
              <td class="text-right">0.14</td>
            </tr>
          </tbody>
        </q-markup-table>
      </q-card-section>
      <br>
      <q-separator inset />
      <q-card-actions align="right">
        <q-btn label="Open project" color="primary" @click="alert = true" />
        <q-btn label="Create new project" color="primary" @click="alert = true" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>

export default {
  name: 'PageIndex',
  data () {
    return {
      welcometext: 'There is currently no project open! Either create a new one, or open a existing.'
    }
  }
}

</script>
