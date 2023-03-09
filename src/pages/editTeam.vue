<template>
  <div>
    <q-card class="page">

      <div class="titleEdit bg-primary">
        <div class="cursor-pointer q-px-lg z-top" @click="$router.back()"  v-show="login_store.isLogged" >
          <q-icon name="arrow_back" />
          <span>profiles</span>
        </div>
        <div class="titleCentered" >
          <span>Edit profile</span>
        </div>
      </div>

      <!-- {{store.conf_team}} -->

      <q-form @submit="editTeam">

        <q-card-section class="q-mb-none q-pb-none" >
          <p class="text-bold" >Name</p>
          <q-input class="q-pb-none" type="text" label="Profile name" filled maxlength="20" v-model="store.conf_team.team_name" :rules="[
              val =>
                (val && val.length > 0 && val.length < 20) ||
                'Up to 20 Text/Digit'
            ]"/>
          <p class="q-pa-xs text-caption text-italic" >https://iamsharing.web.app/{{store.conf_team.url_team}}/[folder]</p>
        </q-card-section>

        <q-card-section class="q-pt-none" >
          <p class="text-bold" >Desciption</p>
          <q-input class="q-pb-none" type="text" label="Description" filled maxlength="20" v-model="store.conf_team.team_desc" :rules="[
              val =>
                (val && val.length > 0 && val.length < 20) ||
                'Up to 20 Text/Digit'
            ]"/>
        </q-card-section>

        <q-card-section>
          <p class="text-bold" >Background color</p>
          <!-- <q-input label="Brand color" v-model="brand_color" style="max-width:100px; margin-bottom:22px" /> -->
          <q-color v-model="store.conf_team.team_color" @change="changeBrandColor()" class="my-picker" style="max-width: 250px" />
        </q-card-section>

        <q-card-section class="q-pb-none" >
          <div class="uploadFileWrapper" >
              <div>
                <p class="text-bold" >Icon (100px x 100px)</p>
                <input
                  type="file"
                  @change="uploadFile($event)"
                  :disabled="!store.conf_team.team_name"
                />
              </div>
              <img :src="uploadedFile" style="max-width: 120px; padding: 16px 0" v-if="uploadedFile" />
              <img :src="store.conf_team.team_icon" style="max-width: 120px; padding: 16px 0" v-if="!uploadedFile" />
            </div>
        </q-card-section>

        <!-- SUBMINT -->
        <q-card-actions align="center" class="q-mt-md text-primary" style="flex-direction:column" >
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
import { firebase_db_store } from 'stores/firebase_db_store.js'
import { login_store } from 'stores/login_store.js'
import { getCssVar, setCssVar } from 'quasar'
import  uploadFile from '../mixins/uploadFile.js'

export default {
  mixins:[uploadFile],
  data () {
    return {
      uploadedFile: '',
      fileName: '',
      textProgress: '',
      store: firebase_db_store(),
      login_store: login_store()
    }
  },
  created(){

      // BUSCAMOS URL TEAM PARA CONF
      let url_team = this.$route.params.team
      this.store.getDataByUrlTeam(url_team)
      // END BUSCAMOS URL TEAM PARA CONF

  },
  computed: {
    // brand_color: {
    //   get(){
    //     return getCssVar('primary')
    //   },
    //   set(value){
    //     setCssVar('primary', value)
    //   }
    // }
  },
  methods: {
    textToGuion(value){
      return value.replace(/\s/g, "-").toLowerCase()
    },
    changeBrandColor(){
      console.log('change: ',this.store.conf_team.team_color)
      setCssVar('primary',this.store.conf_team.team_color)
    },
    editTeam(){

      // const self = this
      // let obj = {}

      // console.log(self.brand_color)

      // const url_team = self.store.conf_team.url_team

      // obj = {
      //   icon: self.store.conf_team.team_icon,
      //   brand_color: self.brand_color,
      //   team_name: self.store.conf_team.team_name,
      //   team_desc: self.store.conf_team.team_desc,
      //   time_updated: Date.now()
      // }

      // ACTUALIZA REGISTRO EN TEAM REF
      this.store.conf_team.team_icon = this.uploadedFile || this.store.conf_team.team_icon
      this.store.updateTeam()
      // END ACTUALIZA REGISTRO EN TEAM REF

    }
  }
}
</script>
