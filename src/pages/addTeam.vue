<template>
  <div>
    <q-card class="page">

      <div class="titleEdit bg-primary">
        <div class="cursor-pointer q-px-lg z-top" @click="goToProfiles()" >
          <q-icon name="arrow_back" />
          <span>profiles</span>
        </div>
        <div class="titleCentered">
          <q-icon name="add_circle" /><span>Create profile</span>
        </div>
      </div>

      <q-form @submit="addTeam">
<!-- {{brand_color}} -->
        <q-card-section class="q-mb-none q-pb-none" >
          <p class="text-bold" >Name</p>
          <q-input class="q-pb-none" type="text" label="Profile name" filled maxlength="20" v-model="store.conf_team.team_name" :rules="[
              val =>
                (val && val.length > 0 && val.length < 20) ||
                'Up to 20 Text/Digit'
            ]"/>
            <p class="q-pa-xs text-caption text-italic" >https://iamsharing.web.app/<b>{{textToGuion(store.conf_team.team_name)}}</b>/<i>folder</i></p>
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
              <img :src="uploadedFile" style="max-width: 120px; padding: 16px 0" />
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
import { db } from 'boot/firebase.js'
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
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
      store: firebase_db_store(),
      login_store: login_store()
    }
  },
  created(){},
  computed: {},
  methods: {
    goToProfiles(){
      this.$router.push({name:'profiles'})
    },
    textToGuion(value){
      return value.replace(/\s/g, "-").toLowerCase()
    },
    changeBrandColor(){
      // console.log('change: ',this.store.conf_team.team_color)
      setCssVar('primary',this.store.conf_team.team_color)
    },
    async addTeam(){

      const self = this
      let objTeam = {}

      const userUID = this.login_store.user.uid
      const url_team = self.textToGuion(self.store.conf_team.team_name)

      this.store.showSpinner = true

      objTeam = {
        uid: userUID,
        url_team: url_team,
        team_icon: self.uploadedFile || self.store.conf_team.team_icon,
        team_color: getCssVar('primary'),
        team_name: self.store.conf_team.team_name,
        team_desc: self.store.conf_team.team_desc
      }

      const docRef = doc(db, "teams", url_team);
      const docSnap = await getDoc(docRef);

      // If team exists
      if (docSnap.exists()) {

        this.store.showSpinner = false
        alert('Team name is already exists! Change the name please.')
        return

      } else {

        // CREA REGISTRO EN TEAM REF
        const refTeam = doc(db, "teams", url_team);

        try {
          await setDoc(refTeam, objTeam);
          this.store.isTeamAdded = true
          this.$router.push('/'+url_team+'/folders')
        } catch (error) {
          this.store.showNotifyFailled(error.message)
        }

      }

    }
  }
}
</script>
