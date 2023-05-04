<template>
  <div>
    <q-card class="page">

      <div class="titleEdit bg-primary">

        <div class="cursor-pointer q-px-lg z-top" @click="goToFolder()" v-show="login_store.isLogged" >
          <q-icon name="arrow_back" />
        </div>

        <div class="titleCentered" >
          <q-icon name="backup" /><span>add title</span>
        </div>

      </div>

      <q-form @submit="addTitle" >

        <q-card-section class="q-mt-none column" >
          <div style="max-width: 300px;">
          <p>Title</p>
            <q-input
              v-model="title_name"
              filled
              autogrow
              type="text"
            />
            <p class="q-mt-md" >ID prev</p>
            <q-input
              v-model="id_prev"
              filled
              autogrow
              type="text"
            />
          </div>
        </q-card-section>

        <!-- SUBMINT -->
        <q-card-actions align="center" class="text-primary" style="flex-direction:column" >
          <q-btn
            type="submit"
            color="accent"
            class="submit"
            style="width:200px"
          >Save</q-btn>
        </q-card-actions>
        <!-- END SUBMINT -->

      </q-form>
    </q-card>
  </div>
</template>

<script>
import { doc, updateDoc} from "firebase/firestore"
import { db } from 'boot/firebase.js'
import { firebase_db_store } from 'src/stores/firebase_db_store'
import { login_store } from 'src/stores/login_store'

export default {
  data () {
    return {
      store: firebase_db_store(),
      login_store: login_store(),
      title_name: '',
      id_prev: ''
    }
  },
  methods: {
    goToFolder(){
      this.$router.push('/'+this.$route.params.team+'/'+this.store.folder_name)
    },
    addTitle(){

      if(!this.title_name || !this.id_prev){
        alert('Complete all fields')
        return
      }

      this.store.showSpinner = true

      // Firebase
      const store = this.store
      const id_prev = this.id_prev
      const title_name = this.title_name

      async function updateFile () {

        const docRef = doc(db, store.conf_team.url_team, store.folder_name, 'files' ,id_prev);

        try {
          await updateDoc(docRef, {title_name: title_name})
          store.showNotifySuccess('Title added')
        } catch (error) {
          store.showNotifyFailled(error)
        }

      }

      updateFile()
      // End Firebase

    }

  }
}
</script>
