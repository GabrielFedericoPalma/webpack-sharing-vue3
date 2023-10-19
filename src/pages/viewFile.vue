<template>

 <q-card class="page q-pb-lg" >

    <div class="titleEdit bg-primary" >
      <div class="cursor-pointer q-px-lg z-top" title="Go to folder" @click="goToFolder()" >
        <q-icon name="arrow_back" />
        <span>folder</span>
      </div>
      <div class="q-mx-auto titleCentered" >
        <q-icon name="article" /><span>File</span>
      </div>
      <div class="cursor-pointer q-px-lg z-top" title="Share file" @click="share()" v-if="login_store.isLogged" >
        <q-icon name="share" />
        <span>share</span>
      </div>
    </div>

  <q-card-section class="row justify-center q-pa-md" >

      <!-- {{store.viewFile}} -->

      <!-- IS IMG -->
      <div class="image" v-if="isImg(store.viewFile.fileType)" >
        <img :src="store.viewFile.url" alt="img" style="width:100%; max-width:1000px" />
      </div>

      <!-- IS PDF
      <div v-if="isPdf(store.viewFile.fileType)" style="width: 80%; height: 320px" >
        <q-pdfviewer
          v-model="visible"
          :src="store.viewFile.url"
          type="html5"
        />
      </div>
      -->

      <!-- <div v-if="isPdf(data.fileType)" >
        <iframe :src="data.url" frameborder="0" style="width: 100%; height: 100%" ></iframe>
      </div> -->

      <!-- IS VIDEO -->
      <div v-if="isVideo(store.viewFile.fileType)" >
          <video controls >
            <source :src="store.viewFile.url" type="video/mp4">
            Your browser does not support the video tag.
          </video>
      </div>

      <!-- IS GRAL FILE
      <div class="image q-mt-md" v-if="!isImg(store.viewFile.fileType) && !isPdf(store.viewFile.fileType) && !isVideo(store.viewFile.fileType)" >
          <q-icon name="task" color="secondary" style="font-size: 200px;" ></q-icon>
      </div>
      -->

  </q-card-section>

  <q-card-section class="q-mb-none q-pb-none" style="max-width: 650px; margin: auto" >
    <p class="text-center fileName" style="margin-bottom:8px" ><strong>{{store.viewFile.fileName}}</strong></p>
    <p class="text-center" style="margin-bottom:8px" v-if="login_store.isLogged"  >Uploaded: <strong>{{dateParse(store.viewFile.fileDate)}}</strong></p>
    <p class="text-center" style="margin-bottom:8px" v-if="login_store.isLogged" >By: <em>{{store.viewFile.user}}</em></p>
    <p class="text-center" v-show="store.viewFile.additionalNote" >{{store.viewFile.additionalNote}}</p>
  </q-card-section>

  <!-- COMMENTS -->
  <!-- <q-card-section class="row justify-center q-ma-none q-pa-none flexButtons" v-if="login_store.isLogged" >
    <addComment />
    <viewComments />
  </q-card-section> -->
 <!-- END COMMENTS -->

  <!-- Edit File -->
  <div class="column items-center justify-center q-mt-none q-pt-none q-pb-md" >
    <a :href="store.viewFile.url" download target="_blank" v-show="login_store.isLogged" >
      <small class="actions">Download</small>
    </a>
    <a :href="store.viewFile.link" target="_blank" v-show="store.viewFile.link" >
      <small class="actions">{{ (store.viewFile.id === '693')? 'Link Grupo Wsp' : 'Link' }}</small>
    </a>
    <small class="actions" @click="alert('Edit file is commin soon')" v-show="login_store.isLogged && store.viewFile.uid == currentUser" >Edit file</small>
    <q-icon name="delete" @click="deleteDoc()" color="black" size="20px" title="Delete file" class="clickeable" v-show="login_store.isLogged && store.viewFile.uid == currentUser" />
  </div>


 </q-card>

</template>

<script>
import { date } from 'quasar'
import { firebase_db_store } from 'src/stores/firebase_db_store';
import { login_store } from 'src/stores/login_store';

// import addComment from 'components/addComment.vue'
// import viewComments from 'components/viewComments.vue'

import fileTypes from 'src/mixins/fileTypes'

export default {
  name: 'viewFile',
  mixins: [fileTypes],
  // components:{addComment, viewComments},
  data () {
    return {
        visible: true,
        data: {},
        currentUser: '',
        store: firebase_db_store(),
        login_store: login_store()
    }
  },
  created() {

      if(this.login_store.user){
        this.currentUser = this.login_store.user.uid
      }

      const url_team = this.$route.params.team
      const folder_name = this.$route.params.id
      const param_file = this.$route.params.img

      this.store.prevFirestoreFolderNameQuery(url_team, folder_name, param_file)

      // this.store.getFileFromFirestore(url_team, folder_name, param_file)

  },
  methods: {
    goBack(){
      this.$router.push(-1)
    },
    dateParse(time){
      return date.formatDate(time, 'DD-MM-YYYY • HH:mm:ss')
    },
    share(){

        const shareData = {
            title: 'I am Sharing',
            text: 'Compartido por Sharing',
            url: window.location.href
          }

          navigator.share(shareData)

    },
    goToFolder(){
      this.$router.push('/'+this.store.conf_team.url_team+'/'+this.$route.params.id)
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

        let cardRef = firestoreRef.collection(this.$store.state.firebase_store.conf_team.url_team).doc(this.$store.state.firebase_store.folder_name).collection("files").doc(this.data.id);

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
    alert(msj){
      alert(msj)
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

  }
}
</script>

<style scoped>
video, .image {width: 100%; max-width: 600px;}

.page {background: #000000bd}

h4, h5 {color: #fff}

p, span {color: #ddd}

small, p a {
  color: aqua;
  letter-spacing: 1px;
  font-size: 13px;
  text-decoration: underline;
}

p.fileName {
 font-size: 16px;
}

</style>
