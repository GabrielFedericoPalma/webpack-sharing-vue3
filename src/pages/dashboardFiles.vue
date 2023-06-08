<template>

 <q-card class="page" >

      <div class="titleEdit bg-primary" >
        <div class="cursor-pointer q-px-lg z-top" @click="goToFolders()"  v-if="login_store.isLogged" >
          <q-icon name="arrow_back" />
          <!-- <span>folders</span> -->
        </div>
        <div class="titleCentered" >
          <q-icon name="folder" /><span class="text-uppercase" >{{store.folder_name}}</span>
        </div>
        <div class="cursor-pointer q-px-lg z-top" title="Share folder" @click="share()" v-show="login_store.isLogged" >
          <q-icon name="share" />
          <span>share</span>
        </div>
      </div>

    <q-card-section class="wrapperFile" >

      <div
        v-for="(item, index, key) in store.firestoreFolderNameData"
        :key="item.$key" :class="{base: item.fileName === 'base.png'}" >

          <!-- IS IMG -->
          <div v-if="isImg(item.fileType)" class="file" >
            <!-- <p>{{ item.orden }}</p> -->
            <!-- <p>{{ item.id }}</p> -->
            <h4 v-show="item.title_name" >{{ item.title_name }}</h4>
            <div class="img" style="background-size:cover; background-position: center;" v-bind:style="{backgroundImage:'url('+item.url+')'}" >
            </div>
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
          <div v-if="isVideo(item.fileType)" class="videoContainer" >
              <!-- <p>{{ item.id }}</p> -->
              <h5 class="q-mb-lg q-mt-none text-left" v-show="item.title_name" >{{ item.title_name }}</h5>
              <video controls>
                <source :src="item.url" type="video/mp4">
                Your browser does not support the video tag.
              </video>
          </div>

          <!-- IS GRAL FILE -->
          <div class="image column items-center justify-center" v-if="!isImg(item.fileType) && !isPdf(item.fileType) && !isVideo(item.fileType)" style="height: 320px" >
            <q-icon name="task" color="secondary" style="font-size: 200px;" ></q-icon>
          </div>

          <!-- Base.png es para tener 2 columnas en desktop cdo hay un sólo ítem en la fila -->
          <p class="text-bold actions ellipsis" v-show="item.fileName !== 'base.png'" >{{item.fileName}}</p>

          <p class="text-center ellipsis" v-show="item.additionalNote" >{{item.additionalNote}}</p>

          <small @click="showFile(item.id)" class="actions" v-show="item.fileName !== 'base.png'" >Details</small>

          <p class="text-center q-mt-none " v-show="item.link" >
            <a :href="item.link" :title="item.link" target="_blank" >Link</a>
          </p>

    </div>

  </q-card-section>

    <q-card-section class="column items-center justify-center q-pt-sm q-pb-lg" v-show="login_store.isLogged" >
      <router-link :to="'/'+$route.params.team+'/'+store.folder_name+'/addTitle'"  >
        <q-btn icon="cloud_upload" label="Add title" color="secondary" />
      </router-link>
      <router-link :to="'/'+$route.params.team+'/'+store.folder_name+'/addFiles'"  >
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

<style scoped >

.page {background: #464646a6;}

h4, h5 {color: aliceblue}

p, span {color: #ddd}

small, p a {
  color: #000;
  letter-spacing: 1px;
  font-size: 13px;
  text-decoration: underline;
}

p.ellipsis {text-align: center; max-width: 350px; margin: 5px auto}
/*
.q-dialog {background: #5d6e60e6;}
.q-dialog .q-btn {width:auto}
*/
.base{opacity: 0 !important}

@media screen and (max-width: 1000px) {
  .base{display: none !important}
}

@media screen and (max-width: 500px) {
  p.ellipsis {max-width: 248px;}
}

</style>
