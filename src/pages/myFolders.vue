<template>
  <div>
    <q-card class="page">
  
      <p class="titleEdit">
        <q-icon name="folder_shared" /><span>MY FOLDERS</span>
      </p>
   
        <q-card-section class="row column center" >
              <!-- <q-btn to="/addFolder" color="primary" style="width:250px; margin:5px auto 16px auto" >
                CREATE FOLDER
              </q-btn>

              <hr style="width:250px" v-if="myFolders.length > 0" > -->

            <div v-for="(link, key) of myFolders" :key="key" style="margin:8px auto; display: flex; flex-direction:column; justify-content: center; align-items: center" >
              <q-btn :to="'/folder/'+link.folderName" color="dark" style="width:250px; margin:8px auto" >
                {{link.folderName}}
              </q-btn>
              <em style="display:block;" v-if="link.withPass" >{{link.autoPass}}</em>
            </div>
            
        </q-card-section>

    </q-card>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  created(){
      this.$store.dispatch('firebase_store/myFoldersQuery',this.$store.state.firebase_store.userUI)
  },
  computed: {
    myFolders: {
      get(){
        return this.$store.state.firebase_store.myFolders
      }
    }
  },
  methods: {
  }
}
</script>
