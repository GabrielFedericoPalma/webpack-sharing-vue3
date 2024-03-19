<template>
  <router-view />

    <!-- SPINNER -->
    <div class="spinnerWrapper" v-if="store.showSpinner" >
      <q-spinner-rings
        color="secondary"
        size="3em"
      />
    </div>
    <!-- END SPINNER -->

</template>

<script>
import { defineComponent } from 'vue'
import { firebase_db_store } from './stores/firebase_db_store';

export default defineComponent({
  name: 'App',
  created(){

  },
  data() {
    return {
      store: firebase_db_store()
    }
  }
})
</script>
