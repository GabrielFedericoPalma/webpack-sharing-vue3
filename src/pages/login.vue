<template>
  <div>

    <q-card class="page ">

      <div class="titleEdit bg-primary" >
        <div class="q-mx-auto">
          <q-icon name="person_add_alt" /><span>LOGIN</span>
        </div>
      </div>

      <q-form @submit="login" >

        <aside v-show="local_url_team" class="column items-center" >
          <p class="q-mb-none" >
            <small>Último acceso</small>
          </p>
          <a :href="'https://iamsharing.web.app/'+local_url_team+'/'+local_folder_name" target="_blank" >
            <q-btn color="accent" >{{ local_team_name }}</q-btn>
          </a>
        </aside>
        <hr>
        <!-- SUBMINT -->
        <q-card-actions align="center" class="column text-primary q-pt-none" >
            <img src="images/Google-G-Logo.png" alt="" style="width: 150px" >
            <q-btn label="Login with Google Account" type="submit" color="primary" class="submit"
            style="margin-top:10px; width:auto; padding:6px 12px" />
            <p class="text-center" >Web app for sharing files<br>under profiles</p>
        </q-card-actions>
        <!-- END SUBMINT -->

      </q-form>

    </q-card>

  </div>
</template>

<script>
import { login_store } from 'stores/login_store.js'

export default {
  data () {
    return {
      login_store: login_store(),
      local_team_name: null,
      local_folder_name: null,
      local_url_team: null
    }
  },
  mounted(){
    this.local_team_name = this.$q.localStorage.getItem('team_name') || ''
    this.local_folder_name = this.$q.localStorage.getItem('folder_name') || ''
    this.local_url_team = this.$q.localStorage.getItem('url_team') || ''
  },
  methods: {
    login(){
      this.login_store.googleLogin()
    }
  }
}
</script>
