<template>

 <q-card class="page" :style="{backgroundImage:'url('+store.conf_team.bgBodyImage+')'}" >

      <div class="titleEdit bg-primary" >
        <div class="cursor-pointer q-px-lg z-top" @click="goToFolders()"  v-if="login_store.isLogged" >
          <q-icon name="arrow_back" />
          <!-- <span>folders</span> -->
        </div>
        <div class="titleCentered" >
          <q-icon name="folder" /><span class="text-uppercase" >{{store.folder_name === 'dj'?'Dj sets':store.folder_name}}</span>
        </div>
        <div class="cursor-pointer q-px-lg z-top" title="Share folder" @click="share()" >
          <q-icon name="share" />
          <span>share</span>
        </div>
      </div>

    <q-card-section class="wrapperFile" :class="{blackShadow: store.conf_team.url_team === 'gpalmadev'}" >

      <div
        v-for="(item, index, key) in store.firestoreFolderNameData"
        :key="item.$key" >

          <!-- IS IMG -->
          <div v-if="isImg(item.fileType)" class="file" >
            <!-- <p>{{ item.orden }}</p> -->
            <!-- <p>{{ item.id }}</p> -->
            <h4 v-show="item.title_name" >{{ item.title_name }}</h4>
            <div class="img" v-bind:style="{backgroundImage:'url('+item.url+')'}" >
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

          <!-- IS AUDIO -->
          <div v-if="isAudio(item.fileType)" class="audioContainer" >
              <!-- <p>{{ item.id }}</p> -->
              <!-- <p>{{ item.orden }}</p> -->
              <h6 class="text-center q-mt-none q-mb-xs text-bold fileName" style="color: aqua" >{{item.fileName}}</h6>
              <p class="text-center q-mb-none" v-show="item.additionalNote" >{{item.additionalNote}}</p>
              <p class="q-mb-xs q-mt-sm text-center text-bold" v-show="item.title_name" style="color: darkkhaki" >{{ item.title_name }}</p>
              <img :src="item.poster" alt="Poster" class="imgPoster" v-show="showGif[index] !== indexGif" >
              <img :src="item?.posterGif" alt="Poster" class="imgPoster" v-show="showGif[index] === indexGif" >
              <audio ref="audio" >
                <source :src="item.url" >
                Your browser does not support the audio tag.
              </audio>
              <aside class="row glutter justify-center q-mb-xs" >
                <q-btn @click="play(index, item.poster)" label="play" color="accent" />
                <q-btn @click="pause(index)" label="pause" color="secondary" />
              </aside>
              <p class="q-mb-none" >
                <a :href="item.url" download target="_blank" >Download</a>
              </p>

          </div>

          <!-- IS GRAL FILE -->
          <div class="image column items-center justify-center" v-if="!isAudio(item.fileType) && !isImg(item.fileType) && !isPdf(item.fileType) && !isVideo(item.fileType)" style="height: 320px" >
            <q-icon name="task" color="secondary" style="font-size: 200px;" ></q-icon>
          </div>

          <aside v-show="!item?.poster" class="commonLinks" >
            <p class="text-center q-mb-none text-bold fileName" >{{item.fileName}}</p>
            <p class="text-center ellipsis-2-lines" v-show="item.additionalNote" >{{item.additionalNote}}</p>

            <small @click="showFile(item.id)" class="actions" >More Details</small>

            <p class="text-center q-mt-none " v-show="item.link" >
              <a :href="item.link" :title="item.link" target="_blank" >Demo Link</a>
            </p>
          </aside>

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
      message: 'There are not files created yet',
      audioElement: '',
      showGif: [0,1,2,3,4],
      indexGif: null,
      savedHeaderImg: '',
      savedBgImg: ''
    }
  },
  created(){
    this.store.showSpinner = true

    const url_team = this.$route.params.team
    const folder_name = this.$route.params.id
    this.store.prevFirestoreFolderNameQuery(url_team, folder_name)
  },
  methods: {
    play(index, poster){

      this.savedHeaderImg = this.savedHeaderImg || this.store.conf_team.bgImage
      this.savedBgImg = this.savedBgImg || this.store.conf_team.bgBodyImage

      this.store.conf_team.bgImage = poster
      this.store.conf_team.bgBodyImage = poster

      const element = this.$refs.audio[index]
      const elements = this.$refs.audio
      for (let i = 0; i < elements.length; i++) {
        elements[i].pause();
      }
      element.play()
      this.indexGif = index
    },
    pause(index){
      // console.log(this.$refs.audio, index);
      this.$refs.audio[index].pause()
      this.indexGif = null

      this.store.conf_team.bgImage = this.savedHeaderImg || this.store.conf_team.bgImage
      this.store.conf_team.bgBodyImage = this.savedBgImg || this.store.conf_team.bgBodyImage

    },
    goToFolders(){
        this.$router.push('/'+this.store.conf_team.url_team+'/folders')
    },
    share(){
        const self = this
        const shareData = {
            title: self.store.conf_team.team_name,
            text: self.store.conf_team.team_name+' '+self.store.conf_team.team_desc,
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
  },
}
</script>

<style scoped >
.page {background: #000000bd}

h4, h5 {color: #fff}
h6 {font-size: 18px; font-weight: 500;}
p, span {color: #fff}

small, p a {
  color: aqua;
  letter-spacing: 1px;
  font-size: 13px;
  text-decoration: underline;
}
p.fileName {
 font-size: 16px;
 color: aqua;
}

p.ellipsis-2-lines {text-align: center; max-width: 350px; margin: 5px auto}

video, .img {border-radius: 10px;}
.blackShadow {background-color: #141516ad}
.commonLinks {
  background-color: #000000bf;
  padding: 10px 4px;
  width: 90%;
  margin:auto;
  border: 2px solid aqua;
  border-radius:12px;
}
.audioContainer {
  width: 350px;
  min-height: 100px;
  background-color: #141516ad;
  padding: 16px 0;
  border-radius: 12px;
  box-shadow: 0px 1px 2px rgb(50 128 243 / 60%);
}
.audioContainer a {
  text-decoration: underline;
}
.imgPoster {
  width: 100%;
  max-width: 200px;
  margin: 8px auto;
  border-radius: 12px;
}

aside .q-btn {
  width: 80px;
}

@media screen and (max-width: 500px) {
  p.ellipsis-2-lines {max-width: 248px;}

  .audioContainer {
    width: 100%;
  }

  .wrapperFile div {
    width: 90%;
  }

}

</style>
