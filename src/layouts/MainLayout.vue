<template>
  <q-layout view="lHh Lpr lFf">

  <!-- **** HEADER **** -->
  <q-header elevated reveal
  :style="[store.conf_team.bgImage ? {backgroundImage:'url('+store.conf_team.bgImage+')'}:{}]"
  style="z-index:9999" >

  <div class="q-py-md row justify-between items-center" style="background-color: rgba(0, 0, 0, 0.35);" >
    <q-toolbar style="width: 30px; z-index:1">
      <q-btn flat dense round icon="menu" aria-label="Menu" @click="drawer = !drawer" style="font-size: 19px" />
    </q-toolbar>

    <div style="position: absolute; width: 100%;" >
      <div class="mainText" >
        <h1>
          {{store.conf_team.team_name}}
        </h1>
        <h2>
          {{ store.conf_team.team_desc }}
        </h2>
      </div>
    </div>

    <div class="q-pa-md q-mr-md"
      :style="[store.conf_team.team_icon ? {backgroundImage:'url('+store.conf_team.team_icon+')'}:{}]"
      style="width:70px; height: 70px; border-radius: 50%; background-position: center; background-size: cover;" >
    </div>
  </div>

  </q-header>
  <!-- **** END HEADER **** -->

  <!-- ***** MENU LATERAL ***** -->
  <q-drawer v-model="drawer" bordered class="bg-grey-1" >

    <q-icon name="navigate_before" @click="drawer = !drawer" style="font-size: 20px; position:absolute; right:6px; top:6px;z-index: 1" class="clickeable" />

  <!-- ***** MENU ADMIN ***** -->
      <q-list>

        <q-item style="border-bottom: 1px dotted #6c6c6c; margin-bottom: 10px;" >
            <q-item-section avatar >
              <q-icon name="account_circle" color="dark" v-if="isLogged" />
              <q-icon name="cloud_upload" color="dark" v-if="!isLogged" />
            </q-item-section>
              <q-item-section>
                <q-item-label v-if="isLogged" >{{userUI}}</q-item-label>
                <q-item-label v-if="!isLogged" style="margin-top:6px" >I am sharing</q-item-label>
              </q-item-section>
        </q-item>

      <div v-if="isLogged" >

        <!-- VIEW TEAMS -->
          <router-link to="/teams" >
            <q-item clickable >
              <q-item-section avatar >
                <q-icon name="groups" color="dark" />
              </q-item-section>
                <q-item-section>
                  <q-item-label>PROFILES</q-item-label>
                </q-item-section>
                <small>{{ store.conf_team.team_name }}</small>
            </q-item>
          </router-link>
        <!-- END VIEW TEAMS -->

          <!-- ALL FOLDERS -->
          <router-link :to="'/'+conf_team.url_team+'/folders'" v-show="conf_team.url_team && conf_team.url_team !== 'undefined'" >
            <q-item clickable >
              <q-item-section avatar >
                <q-icon name="folder_shared" color="dark" />
              </q-item-section>
                <q-item-section>
                  <q-item-label>FOLDERS</q-item-label>
                </q-item-section>
                <small>{{ store.folder_name }}</small>
            </q-item>
          </router-link>
        <!-- END ALL FOLDERS -->

      </div>

        <!-- LOGOUT -->
        <a href="#" @click="logout($event)" class="absolute-bottom" style="border-top: 1px dotted #6c6c6c;" v-if="isLogged" >
          <q-item clickable >
          <q-item-section avatar >
            <q-icon name="person_remove" color="dark" />
          </q-item-section>
            <q-item-section>
              <q-item-label>Logout</q-item-label>
            </q-item-section>
            <small>v 4.0.1</small>
          </q-item>
        </a>
        <!-- END LOGOUT -->

        <!-- LOGIN -->
        <router-link to="/login" v-if="!isLogged" class="absolute-bottom" style="border-top: 1px dotted #6c6c6c;" >
          <q-item clickable >
          <q-item-section avatar >
            <q-icon name="person" color="dark" />
          </q-item-section>
            <q-item-section>
              <q-item-label>Login</q-item-label>
            </q-item-section>
            <small>v 4.0.1</small>
          </q-item>
        </router-link>
        <!-- END LOGIN -->

      </q-list>

  <!-- ****** END MENU ADMIN ***** -->

      </q-drawer>
  <!-- ******* END MENU LATERAL ******* -->

  <!-- PAGE CONTAINER -->
      <q-page-container id="pageContainer"
        v-bind:style="{backgroundImage:'url('+store.conf_team.bgBodyImage+')'}">
        <router-view />
      </q-page-container>
  <!-- END PAGE CONTAINER -->

    </q-layout>
  </template>

  <script>
  import { mapState } from 'pinia';
  import { firebase_db_store } from 'stores/firebase_db_store.js'
  import { login_store } from 'stores/login_store.js'

  export default {
    name: 'MainLayout',
    components:{},
    data () {
      return {
        drawer : false,
        store: firebase_db_store(),
        login_store: login_store()
      }
    },
    created(){

      if(this.isLogged){
        this.drawer = true
      }else{
        this.drawer = false
      }

        const urlTeam = this.$route.params.team

        // console.log({urlTeam})

        // BUSCAMOS URL TEAM PARA CONF
        this.store.getDataByUrlTeam(urlTeam)

    },
    methods: {
      // addFiles(event){
      //   this.$router.push('/folder/'+this.$store.state.firebase_store.folder_name+'/addFiles')
      // },
      login(){
        this.$router.push('/login')
      },
      logout(){
        this.login_store.googleLogout()
      },
      installApp(){
        // console.log('install app')
      }
    },
    computed: {
      ...mapState(firebase_db_store, ['showSpinner','conf_team']),
      ...mapState(login_store, ['userUI','isLogged'])
    }
  }
  </script>

<style scoped>

#pageContainer {
  background-size:cover; background-attachment: fixed;
}

@font-face {
  font-family: GreatVibes;
  src: url(../assets/fonts/GreatVibes-Regular.ttf);
}

.mainText {margin: auto; width: fit-content;}
h1, h2 {background: #120931ab; width: fit-content; padding: 8px 12px; margin: auto; border-radius: 8px}
h1{font-family: 'GreatVibes', Arial;font-size:33px; line-height:1; letter-spacing: 2px; text-align: center; text-shadow: 1px 2px 6px black}
h2{font-size:12px; letter-spacing: 2px; line-height: 1; text-align: center; text-shadow: 1px 2px 6px black}


@media screen and (max-width: 500px) {
  h1 {font-size:26px}
}

</style>
