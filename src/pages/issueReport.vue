<template>

 <q-card class="page" >
      <div class="titleEdit bg-primary" >
        <div class="q-mx-auto">
          <q-icon name="handyman" /><span>NEW FEATURES</span>
        </div>
      </div>

      <q-form @submit="issueReport">
        <q-card-section>
          <p class="text-bold" >Add a new feature or report an issue</p>
          <q-input
            filled
            v-model="text_issue"
            label="Description"
            placeholder="Description"
            hint="Description"
            type="textarea"
            autofocus
            :rules="[val =>(val && val.length > 0)]"
          />
        </q-card-section>

        <q-card-section style="padding-top:0; margin-top:0; margin-bottom:0; padding-bottom:0" >
            <div class="uploadFileWrapper" >
              <div>
                <p>Upload Screenshot</p>
                <input
                  type="file"
                  @change="uploadFile($event)"
                />
              </div>
            </div>
        </q-card-section>

        <!-- SUBMINT -->
        <q-card-actions align="center" class="column text-primary" >
          <!-- <q-btn label="Crear" v-close-popup color="primary" @click="registro()" /> -->
          <q-btn
            label="save"
            type="submit"
            color="primary"
            class="submit"
            :disabled="disabledSubmit"
          />
          <p style="margin: 0" ><em>{{textProgress}}</em></p>
        </q-card-actions>
        <!-- END SUBMINT -->

        <!-- SHOW FORMAT FILES -->
        <q-card-section class="row justify-center" style="padding:0;" >

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

      </q-form>

  <q-card-section class="column justify-center" style="align-items: center; max-width:500px; margin:auto" >
    <!-- ISSUES FOR -->

    <div v-for="(item, index) in issueList" :key="item.$key" style="border-bottom: 1px dashed #999; padding-bottom:22px; margin-bottom:22px" >

        <p style="font-weight: 500" >
          <span>{{item.uid}}</span> - <span>{{dateParse(item.fileDate)}}</span>
        </p>

        <p>{{item.text_issue}}</p>

        <img
          :src="item.file"
          alt=""
          style="width:100%; max-width: 500px"
          class="q-my-md"
        />

    </div>

  </q-card-section>

 </q-card>

</template>

<script>

import { storageRef, firestoreRefIssues } from 'boot/firebase.js';
import firebase from "firebase/app";

import { date } from 'quasar'

export default {
  data () {
    return {
      text_issue: '',
      uploadedFile: '',
      fileName: '',
      textProgress: '',
      disabledSubmit: false,
      fileType: '',
      initImg: true,
      issueList: []
    }
  },
  created() {

    if(!this.$store.state.firebase_store.isLogged){
      this.$router.push('/login')
    }

    let context = this.$store
    let self = this

    context.commit('firebase_store/showSpinner', true)

    firestoreRefIssues.orderBy('fileDate', 'desc').get().then((querySnapshot) => {
      self.issueList = []
      if(!querySnapshot.empty){

        querySnapshot.forEach((doc) => {
          self.issueList.push(doc.data());
        });

        context.commit('firebase_store/showSpinner', false)
      }else{
        // console.log('else')
        context.commit('firebase_store/showSpinner', false)
      }

    }).catch((error) => {
      // console.log("Error getting document Cards:", error);
      context.commit('firebase_store/showSpinner', false)
  });

  },
  methods: {
    dateParse(time){
      return date.formatDate(time, 'DD-MM-YYYY • HH:mm:ss')
    },
    isImg(fileType) {

      if(this.fileType !== '') {
        return fileType == 'image/png' || fileType == 'image/jpeg' || fileType == 'image/svg+xml'
      }

    },
    uploadFile(event){

            var self = this
            self.disabledSubmit = true
            var file = event.target.files[0]
            this.fileName = file.name
            this.fileType = file.type

            self.isImg(file.type)

            var uploadTask = storageRef.child(this.folder_name+'/'+this.fileName).put(file);

            // Listen for state changes, errors, and completion of the upload.
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,

              // on state changeing
              function(snapshot) {

                  // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 95;
                  self.textProgress = 'Upload is ' + progress + '% done';

              }, function(error) {
                self.disabledSubmit = true
                // console.log('ERROR: ', error.serverResponse)
                self.showNotifyFailled(error)

              }, function() {
                // success upload
                self.textProgress = 'Upload is ' + 97 + '% done';
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                self.textProgress = 'Upload is ' + 100 + '% done (click Save)';
                self.disabledSubmit = false
                self.uploadedFile = downloadURL;
                self.initImg = false;

            });
            // End getDonwloadUrl function

        });
    },
    issueReport(){
      // SE CREA FOLDER ASOCIADO A USUARIO
      let self = this
      let context = this.$store

      context.commit('firebase_store/showSpinner', true)

      let obj = {
        uid : this.$store.state.firebase_store.userUI,
        text_issue: this.text_issue,
        file: this.uploadedFile,
        fileName: this.fileName,
        fileType: this.fileType,
        fileDate: Date.now()
      }

        // REPORT ISSUE FIREBASE
        firestoreRefIssues.doc().set(obj)
        .then(() => {
          // console.log("Document successfully written!");
          context.commit('firebase_store/showSpinner', false)
          self.showNotifySuccess()

                this.text_issue = ''
                this.uploadedFile = ''
                this.fileName = ''
                this.fileType = '',
                this.textProgress = '',
                this.initImg = true

        })
        .catch((error) => {
          // console.error("Error writing document Add User: ", error);
          context.commit('firebase_store/showSpinner', false)
          self.showNotifyFailled()
        });
        // END REPORT ISSUE FIREBASE

        self.issueList.splice(0, 0, obj)

    },
    showNotifySuccess () {
      this.$q.notify({
        message: 'Issue Reported, it will be fix soon, thanks :)-',
        color: 'positive',
        timeout: 3000
      })
    },
    showNotifyFailled (error) {
      this.$q.notify({
        message: error,
        color: 'negative',
        timeout: 4000
      })
    }
  },
  computed: {

  }
}
</script>
