<template>
    <q-card class="page" >

      <div class="titleEdit bg-primary" >
        <div class="cursor-pointer q-px-lg z-top" title="Go to folders" @click="goToFolders()"  v-if="login_store.isLogged" >
          <q-icon name="arrow_back" />
          <span>folders</span>
        </div>
        <div class="titleCentered">
            <q-icon name="password" /><span>Password required</span>
        </div>
      </div>

      <!-- {{$store.state.firebase_store.passOk}} -->
      <q-form @submit="send" style="padding-top:55px" >
        <q-input
        :type="isPwd ? 'password' : 'text'"
        label="Password required"
        v-model="value"
        rounded
        standout
        :rules="[ val => val && val.length > 0]"
        >
            <template v-slot:append >
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
        </q-input>
        <p style="margin:22px auto 0 auto; text-align: center" >
            <q-btn label="Enter" color="primary" type="submit" />
        </p>
      </q-form>
    </q-card>
</template>

<script>
import { firebase_db_store } from 'stores/firebase_db_store.js'
import { login_store } from 'stores/login_store.js'

export default {
    data() {
      return {
        store: firebase_db_store(),
        login_store: login_store(),
        value: '',
        isPwd: true
      }
    },
    methods: {
        goToFolders(){
            this.$router.push('/'+this.store.conf_team.url_team+'/folders')
        },
        send(){

            if(this.value == this.store.pass){

                this.store.passOk = true

                // IS FILE OR FOLDER
                if(this.$route.params.fileId === 'folder'){
                    this.$router.push('/'+this.store.conf_team.url_team+'/'+this.store.folder_name)
                }else{
                    this.$router.push('/'+this.store.conf_team.url_team+'/'+this.store.folder_name+'/file/'+this.$route.params.fileId)
                }
                // END IS FILE OR FOLDER

            }else{
                this.store.passOk = false
                alert('Wrong password!')
            }
        }
    }
}
</script>

<style>
.q-field--standout.q-field--highlighted .q-field__control {background: rgb(55 58 57 / 41%)}
</style>
