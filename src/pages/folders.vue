<template>
  <div>
    <q-card class="page">

      <div class="titleEdit bg-primary">
        <div class="q-mx-auto" >
          <q-icon name="folder_shared" /><span>FOLDERS</span>
        </div>
      </div>

        <q-card-section class="column justify-center items-center" >

          <q-toggle color="primary" label="Only my folders" v-model="switchMyFolders" class="q-mb-lg" />

          <em v-if="!store.folders.length" >{{message}}</em>

          <div v-for="(link, key) of store.folders" :key="key" style="margin:3px auto 6px auto; display: flex; flex-direction:column; justify-content: center; align-items: center" >
            <small>{{link.user}}</small>
            <q-btn :to="'/'+url_team+'/'+link.name" color="dark" >
              {{link.name}}
            </q-btn>
            <small v-if="login_store.user.uid == link.uid" >{{link.autoPass}}</small>
          </div>

          <router-link :to="'/'+url_team+'/addFolder'" class="q-my-md" >
            <q-btn label="create folder" icon="add_circle" color="accent" />
          </router-link>

        </q-card-section>

    </q-card>
  </div>
</template>

<script>
import { mapState } from 'pinia';
import { firebase_db_store } from 'stores/firebase_db_store.js'
import { login_store } from 'stores/login_store.js'

export default {
  data () {
    return {
      switchMyFolders: false,
      message: 'There are not folders created yet',
      store: firebase_db_store(),
      login_store: login_store()
    }
  },
  created(){

      // BUSCAMOS URL TEAM PARA CONF
      this.store.getDataByUrlTeam(this.url_team)
      // END BUSCAMOS URL TEAM PARA CONF

      // **query folders**
      this.store.queryFolders(this.url_team)
      // **End query folders**

  },
  watch: {
    switchMyFolders(newValue, oldValue){
      if(newValue==true){
        this.store.folders =  this.store.allFolders.filter(user => user.user == this.store.userUI)
      }else{
        this.store.folders = this.store.allFolders
      }
    }
  },
  methods: {

  },
  computed: {
    url_team: {
      get(){
        return this.$route.params.team
      }
    }
  }
}
</script>
