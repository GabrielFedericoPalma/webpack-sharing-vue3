<template>

 <q-card class="page" style="padding-bottom: 33px" >
    <p class="titleEdit bg-primary" >
      <q-icon name="edit" /><span>EDIT FILE</span>
    </p>

  <q-card-section class="row justify-between" style="padding:0 30px 0 16px" >
    <!-- v-if="$store.state.firebase_store.goToFolder" -->
    <q-btn icon="arrow_back" @click="goToFolder()" label="go to folder" color="dark"  />
    <q-btn icon="share" label="Share file" @click="share()" color="dark" v-if="$store.state.firebase_store.isLogged" />
  </q-card-section>

<p style="margin:0; padding:0; text-align: center;" class="text-bold" >{{this.$store.state.firebase_store.folder_name}}</p>

  <q-card-section class="row justify-center" style="padding:16px" >

    <em>Edit file is commig soon</em>

      <!-- <div class="image" v-if="isImg(data.fileType)" >
        <img :src="data.url" alt="img" style="width:100%; max-width:1000px" />
      </div>

      <div v-if="isPdf(data.fileType)" style="width: 80%; height: 320px" >
        <q-pdfviewer
          v-model="visible"
          :src="data.url"
          type="html5"
        />
      </div>

      <div v-if="isVideo(data.fileType)" >
          <video width="100%" height="100%" controls >
            <source :src="data.url" type="video/mp4">
            Your browser does not support the video tag.
          </video>
      </div>

      <div class="image q-mt-md" v-if="!isImg(data.fileType) && !isPdf(data.fileType) && !isVideo(data.fileType)" >
          <q-icon name="task" color="secondary" style="font-size: 200px;" ></q-icon>
      </div> -->

  </q-card-section>

  <div class="row justify-center q-mt-md" v-if="$store.state.firebase_store.isLogged" >
    <q-icon name="delete" @click="deleteDoc()" color="black" size="20px" title="Delete file" class="clickeable" />
  </div>

 </q-card>

</template>

<script>

import { firestoreRef } from 'boot/firebase.js';
import addComment from 'components/addComment.vue'
import viewComments from 'components/viewComments.vue'

export default {
  name: 'viewFile',
  components:{addComment, viewComments},
  data () {
    return {
        visible: true,
        data: {}
    }
  },
  created() {

      // console.log('EDIT FILE: ', this.$route.params.img)

      let context = this.$store

      context.commit('firebase_store/showSpinner', true)

      var docRef = firestoreRef.collection(this.$route.params.team).doc(this.$route.params.id).collection('files').doc(this.$route.params.img);

    // let arr = []

    docRef.get().then((doc) => {
        if (doc.exists) {
            this.data = doc.data()
            context.commit('firebase_store/showSpinner', false)
        } else {
            // doc.data() will be undefined in this case
            // console.log("No such document!");
            context.commit('firebase_store/showSpinner', false)
        }
    }).catch((error) => {
        // console.log("Error getting document:", error);
        context.commit('firebase_store/showSpinner', false)
    });

  },
  methods: {
    share(){

        const shareData = {
            title: 'Tonic3Life',
            text: 'Compartido por Sharing',
            url: window.location.href
          }

          navigator.share(shareData)

    },
    isImg(fileType) {
      return fileType == 'image/png' || fileType == 'image/jpeg' || fileType == 'image/svg+xml'
    },
    isPdf(fileType){
      return fileType == 'application/pdf'
    },
    isVideo(fileType){
      return fileType == 'video/mp4'
    },
    isZip(fileType){
      return fileType == 'application/zip' || fileType == 'application/x-7z-compressed' || fileType == 'application/x-tar' || fileType == 'application/x-rar-compressed'
    },
    goToFolder(){
      this.$router.push('/'+this.$route.params.team+'/'+this.$route.params.id)
    },
    deleteDoc() {
      let self = this

      this.$q.dialog({
        title: 'Confirm',
        message: 'Are you sure to delete ? '+this.data.fileName,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$store.commit('firebase_store/showSpinner', true)

        let cardRef = firestoreRef.collection(this.$route.params.team).doc(this.$store.state.firebase_store.folder_name).collection("files").doc(this.data.id);

        cardRef.delete().then(() => {
            this.$store.commit('firebase_store/showSpinner', false)
            this.showNotifySuccess(self.data.id)
            this.goToFolder()
        }).catch((error) => {
            // console.error("Error removing document: ", error);
            this.$store.commit('firebase_store/showSpinner', false)
            this.showNotifyFailled(error)
        });

      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    showNotifySuccess (fileName) {
      this.$q.notify({
        message: fileName+' has been deleted',
        color: 'positive',
        timeout: 2000
      })
    },
    showNotifyFailled (error) {
      this.$q.notify({
        message: error,
        color: 'negative'
      })
    }
  },
  computed: {
    fileList: {
      get() {
        return this.$store.state.firebase_store.firestoreFolderNameData
      }
    }
  }
}
</script>
