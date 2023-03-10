<template>
  <div>
    <q-card class="page">
      <!-- <p>is logged {{$store.state.firebase_store.isLogged}}</p> -->
      <div class="titleEdit bg-primary">
        <div class="cursor-pointer q-px-lg z-top" @click="goToFolders()" >
          <q-icon name="arrow_back" />
        </div>
        <div class="titleCentered" >
          <q-icon name="create_new_folder" /><span>Create folder</span>
        </div>
      </div>

      <q-form @submit="createFolder">

        <q-card-section>
          <p class="text-center text-bold" style="padding:0; margin:0" >Folder link</p>
          <em style="text-align: center; display: block; margin-bottom:30px">
            <span class="text-primary" >iamsharing.web.app/{{store.conf_team.url_team}}/<strong>{{textToGuion(folder_name)}}</strong></span>
          </em>

          <q-input
            filled
            v-model="folder_name"
            label="Folder Name"
            placeholder="Folder Name"
            hint="Folder Name"
            autofocus
            :rules="[
              val =>
                (val && val.length > 0 && val.length < 20) ||
                'Up to 20 Text/Digit'
            ]"
          />

          <div class="q-mt-sm">
            <q-checkbox v-model="withPass" label="Automatic password to folder" />
            <em style="display:block; margin-left: 16px" >{{autoPass()}}</em>
          </div>

        </q-card-section>

        <q-card-section style="padding-top:0; margin-top:0" >
          <!-- <p class="text-center q-mt-md" >At least 1 file is required</p> -->
          <!-- <p :class="{ disabled: Number(folder_name) < 1 }">Upload File (optional)</p> -->
          <!-- :disabled="Number(folder_name) < 1" -->
            <div class="uploadFileWrapper" style="margin-bottom:0" >
              <div>
                <p>Upload File (optional)</p>
                <input
                  type="file"
                  @change="uploadFile($event)"
                  :disabled="!folder_name"
                />
              </div>
            </div>
        </q-card-section>


      <div class="q-pl-lg q-my-md" style="max-width: 300px;">
        <p>File description</p>
          <q-input
            v-model="initComment"
            filled
            autogrow
            type="textarea"
          />
        </div>

        <!-- SHOW FORMAT FILES -->
        <q-card-section class="row justify-center" style="padding:0" >

        <img
          :src="uploadedFile"
          alt=""
          style="max-width: 300px"
          class="q-my-md"
          v-if="isImg(fileType)"
        />

        <div class="image q-mt-md" v-if="!isImg(fileType)" >
          <q-icon name="task" color="secondary" style="font-size: 200px;" v-if="!initImg" ></q-icon>
        </div>
        </q-card-section>

        <p class="text-center text-primary" v-if="!initImg" >{{fileName}}</p>
        <!-- END SHOW FORMAT FILES -->

        <!-- SUBMINT -->
        <q-card-actions align="center" class="text-primary" style="flex-direction:column" >
          <q-btn
            label="Save"
            type="submit"
            color="accent"
            class="submit"
          />
        </q-card-actions>
        <!-- END SUBMINT -->

      </q-form>
    </q-card>
  </div>
</template>

<script>
import { db } from 'boot/firebase.js'
import { doc, setDoc } from "firebase/firestore";
import { firebase_db_store } from 'src/stores/firebase_db_store'
import { login_store } from 'src/stores/login_store'
import fileTypes from 'src/mixins/fileTypes'
import uploadFile from 'src/mixins/uploadFile'
import { Notify } from 'quasar'

export default {
  mixins: [fileTypes,uploadFile],
  data () {
    return {
      store: firebase_db_store(),
      login_store: login_store(),
      folder_name: '',
      uploadedFile: '',
      fileName: '',
      fileType: '',
      initImg: true,
      initComment:'',
      withPass: false
    }
  },
  created(){},
  computed: {
    url_team: {
      get(){
        return this.$route.params.team
      }
    }
  },
  methods: {
    goToFolders(){
        this.$router.push('/'+this.store.conf_team.url_team+'/folders')
    },
    textToGuion(value){
      return value.replace(/\s/g, "-").toLowerCase()
    },
    autoPass(){
      if(this.withPass)
      return this.textToGuion(this.folder_name + (this.folder_name.length * 3))
    },
    async createFolder(){

      this.store.showSpinner = true

      const self  = this

      const imgId =  Math.floor(Math.random()*(999-100+1)+100)
      let objFolderSet, objFileSet

      if(this.uploadedFile){
        objFileSet = {
          user : this.login_store.userUI,
          uid : this.login_store.user.uid,
          name: this.textToGuion(this.folder_name),
          url: this.uploadedFile,
          fileName: this.fileName,
          fileType: this.fileType,
          fileDate: Date.now(),
          id: String(imgId),
          additionalNote: this.initComment,
          withPass: this.withPass,
          autoPass: this.autoPass() || '',
          url_team: this.url_team,
          orden: 0
        }
      }else{
        objFolderSet = {
          user : this.login_store.userUI,
          uid : this.login_store.user.uid,
          name: this.textToGuion(this.folder_name),
          withPass: this.withPass,
          autoPass: this.autoPass() || '',
          url_team: this.url_team,
        }
      }

      // CREA UN REGISTRO EN DB FOLDER_NAME
      if(objFolderSet){
        try {
          await setDoc(doc(db, self.url_team, self.folder_name), objFolderSet);
          self.$router.push('/'+self.url_team+'/'+self.folder_name)
        } catch (error) {
          self.store.showNotifyFailled(error)
        }

      }

      // CREA UN REGISTRO EN DB FOLDER_NAME FILES
      if(objFileSet){
        try {
          await setDoc(doc(db, self.url_team, self.folder_name), {});
          await setDoc(doc(db, this.url_team, this.folder_name, 'files', String(imgId)), objFileSet);
          self.$router.push('/'+self.url_team+'/'+self.folder_name)
        } catch (error) {
          self.store.showNotifyFailled(error)
        }

      }

    }
  }
}
</script>
