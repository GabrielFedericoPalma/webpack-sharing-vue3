<template>

 <q-card class="page" >

      <div class="titleEdit bg-primary" >
        <div class="cursor-pointer q-px-lg z-top" @click="goToFolders()"  v-if="login_store.isLogged" >
          <q-icon name="arrow_back" />
          <!-- <span>folders</span> -->
        </div>
        <div class="titleCentered" >
          <span class="text-uppercase" >{{store.folder_name}}</span>
        </div>
        <div class="cursor-pointer q-px-lg z-top" title="Share folder" @click="share()" v-show="login_store.isLogged" >
          <q-icon name="share" />
          <span>share</span>
        </div>
      </div>

    <q-card-section class="row justify-center" >

      <div class="wrapperFile"
        v-for="(item, index, key) in store.firestoreFolderNameData"
        :key="item.$key" >

          <!-- IS IMG -->
          <div v-if="isImg(item.fileType)" style="height: 320px" class="image" >
            <div class="img" style="background-size:cover; background-position: center;" v-bind:style="{backgroundImage:'url('+item.url+')'}" ></div>
          </div>

          <!-- IS PDF
          <div v-if="isPdf(item.fileType)" style="height: 320px" >
            <q-pdfviewer
              v-model="visible"
              :src="item.url"
              type="html5"
            />
          </div>
          -->

          <!-- IS VIDEO -->
          <div v-if="isVideo(item.fileType)" >
              <video width="100%" height="100%" controls>
                <source :src="item.url" type="video/mp4">
                Your browser does not support the video tag.
              </video>
          </div>

          <!-- IS GRAL FILE -->
          <div class="image column items-center justify-center" v-if="!isImg(item.fileType) && !isPdf(item.fileType) && !isVideo(item.fileType)" style="height: 320px" >
            <q-icon name="task" color="secondary" style="font-size: 200px;" ></q-icon>
          </div>

          <p class="text-bold actions" >{{item.fileName}}</p>
          <small @click="showFile(item.id)" class="actions" >Details</small>

    </div>

  </q-card-section>

    <q-card-section class="column items-center justify-center q-pt-sm q-pb-lg" >
      <!-- <em v-if="!store.firestoreFolderNameData.length" class="q-pb-md" >{{message}}</em> -->
      <router-link :to="'/'+$route.params.team+'/'+store.folder_name+'/addFiles'" v-if="login_store.isLogged" >
        <q-btn icon="cloud_upload" label="Add files" color="accent" />
      </router-link>
    </q-card-section>

 </q-card>

</template>

<script>
import { date } from 'quasar'
import { firebase_db_store } from 'stores/firebase_db_store.js'
import { login_store } from 'stores/login_store.js'
import fileTypes from 'src/mixins/fileTypes'

export default {
  mixins:[fileTypes],
  name: 'dashboardFiles',
  components:{},
  data () {
    return {
      store: firebase_db_store(),
      login_store: login_store(),
      visible: true,
      message: 'There are not files created yet'
    }
  },
  created(){
    this.store.showSpinner = true

    const url_team = this.$route.params.team
    const folder_name = this.$route.params.id
    this.store.prevFirestoreFolderNameQuery(url_team, folder_name)
  },
  methods: {
    goToFolders(){
        this.$router.push('/'+this.store.conf_team.url_team+'/folders')
    },
    share(){

        const shareData = {
            title: 'GPalmadev',
            text: 'Compartido por I am sharing',
            url: window.location.href
          }

          navigator.share(shareData)

    },
    dateParse(time){
      return date.formatDate(time, 'DD-MM-YYYY • HH:mm:ss')
    },
    prompt () {
      let self = this
      this.$q.dialog({
        title: 'Folder with password',
        prompt: {
          model: '',
          isValid: val => val == self.$route.params.id + (self.$route.params.id.length * 3), // << here is the magic
          type: 'text' // optional
        },
        cancel: true,
        persistent: true
      }).onOk(data => {
        // console.log('>>>> OK, received', data)
      }).onCancel(data => {
        self.$router.push('/')
        this.hide()
      })
    },
    showFile(id){
      console.log(id)
      // this.$store.commit('firebase_store/goToFolder', true)
      this.$router.push('/'+this.$route.params.team+'/'+this.$route.params.id+'/file/'+id)
    }
  },
  computed: {

  }
}
</script>

<style>
.q-dialog {background: #5d6e60e6;}
.q-dialog .q-btn {width:auto}
</style>
