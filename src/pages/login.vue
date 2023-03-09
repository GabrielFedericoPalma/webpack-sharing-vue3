<template>
  <div>

    <q-card class="page ">

      <div class="titleEdit bg-primary" >
        <div class="q-mx-auto">
          <q-icon name="person_add_alt" /><span>LOGIN</span>
        </div>
      </div>

      <q-form @submit="login" >

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
      login_store: login_store()
    }
  },
  methods: {
    login(){
      this.login_store.googleLogin()
    }
  }
}
</script>
