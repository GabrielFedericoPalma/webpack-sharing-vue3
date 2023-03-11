<template>
  <div>
    <q-card class="page">

      <div class="titleEdit bg-primary">

        <div class="cursor-pointer q-px-lg z-top" @click="goToFolder()" v-show="login_store.isLogged" >
          <q-icon name="arrow_back" />
        </div>

        <div class="titleCentered" >
          <q-icon name="backup" /><span>add files</span>
        </div>

      </div>

      <q-form @submit="addFile" >
        <p class="text-center" >{{store.folder_name}}</p>
       <q-card-section class="q-pt-none" >
        <div class="uploadFileWrapper">
          <div>
            <p>Upload File</p>
            <input
              id="inputUploadFile"
              type="file"
              @change="uploadFile($event)"
              required
            />
          </div>
        </div>
        </q-card-section>

        <q-card-section class="q-mt-none" >
        <div style="max-width: 300px;">
        <p>Additional note</p>
          <q-input
            v-model="initComment"
            filled
            autogrow
            type="textarea"
          />
        </div>
        </q-card-section>

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

        <p class="text-center text-primary" v-if="!initImg&&showFileName" >{{fileName}}</p>
        <!-- END SHOW FORMAT FILES -->

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
import { firebase_db_store } from 'src/stores/firebase_db_store'
import { login_store } from 'src/stores/login_store'
import fileTypes from 'src/mixins/fileTypes'
import uploadFile from 'src/mixins/uploadFile'

export default {
  mixins: [fileTypes,uploadFile],
  data () {
    return {
      store: firebase_db_store(),
      login_store: login_store(),
      fileName: '',
      fileType: '',
      initImg: true,
      showFileName: false,
      initComment:'',
      imgId: '000',
      uploadedFile: ''
    }
  },
  methods: {
    goToFolder(){
      this.$router.push('/'+this.$route.params.team+'/'+this.store.folder_name)
    },
    addFile(){

      if(!this.uploadedFile){
        alert('Add a file')
        return
      }

      // SE CREA FOLDER ASOCIADO A USUARIO

      let imgId = Math.floor(Math.random()*(999-100+1)+100)
      let imgIdStr = String(imgId)
      this.imgId = imgIdStr

      let obj = {
        user: this.login_store.userUI,
        uid: this.login_store.user.uid,
        folder_name: this.store.folder_name,
        file: this.uploadedFile,
        fileName: this.fileName,
        fileType: this.fileType,
        initComment: this.initComment,
        id: imgIdStr
      }

      this.store.firestoreAddFiles(obj)

    }

  }
}
</script>
