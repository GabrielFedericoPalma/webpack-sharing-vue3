<template>

  <q-card class="page" >

    <div class="titleEdit bg-primary">
      <div class="q-mx-auto">
          <q-icon name="groups" /><span>PROFILES</span>
      </div>
    </div>

    <q-card-section class="column justify-center items-center q-mt-md" >
      <p class="text-bold" v-if="teams.length" >Choose profile</p>

      <div v-for="team of teams" :key="team.url_team" class="q-mb-sm" >
        <router-link :to="'/'+team.url_team+'/folders'" >
          <q-btn color="dark" :label="team.team_name" class="row space-between" />
        </router-link>
        <small @click="editTeam(team.url_team)" class="actions" v-if="team.uid == user.uid" >Edit profile</small>
      </div>
        <em v-if="!teams.length" >{{message}}</em>
      <router-link to="/addTeam" class="q-mt-md" >
        <q-btn color="accent" icon="add_circle" label="profile" />
      </router-link>
    </q-card-section>

  </q-card>

</template>

<script>

  import { mapState } from 'pinia';
  import { firebase_db_store } from 'stores/firebase_db_store.js'
  import { login_store } from 'stores/login_store.js'

  export default {
    name: 'PageIndex',
    components:{},
    data () {
      return {
        message: 'There are not teams created yet'
      }
    },
    created(){
      const store = firebase_db_store()
      store.getFirestoreTeams()

    },
    methods: {
      editTeam(editTeam){
        this.$router.push('/'+editTeam+'/editTeam')
      }
    },
    computed: {
      ...mapState(firebase_db_store, ['teams']),
      ...mapState(login_store, ['user'])
    }
  }
</script>

<style>
.q-card-section {margin-top:22px}
a span {color: #fff}
</style>
