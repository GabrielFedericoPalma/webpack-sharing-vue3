import { defineStore } from 'pinia';
import { db } from 'boot/firebase.js'
import { doc, query, collection, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore"
import { getCssVar, setCssVar, LocalStorage, Notify } from 'quasar'

export const firebase_db_store = defineStore('firebase_db_store', {
  state: () => ({
    teams: [],
    conf_team: {
      url_team: 'default',
      team_name: 'I am',
      team_desc: 'Sharing',
      team_color: '#466b73',
      team_icon: '/images/sharing-icon.png',
      bgImage: '',
      bgBodyImage: ''
    },
    folder_name: 'undefined',
    isFolder: false,
    isTeamAdded: false,
    pass: null,
    passOk: false,
    folders: [],
    allFolders: [],
    myFolders: [],
    viewFile: {},
    showSpinner: false,
    firestoreFolderNameData: []
  }),
  getters: {

  },
  actions: {
    setShowSpinner(data){
      this.showSpinner = data
    },
    set_conf_team(obj){
      this.conf_team = obj
    },
    set_url_team(url_team){
      this.conf_team.url_team = url_team
    },
    set_folder_name(folder_name){
      this.folder_name = folder_name
    },
    isFolder(boolean){
      this.isFolder = boolean
    },
    autoPass(pass){
      this.pass = pass
    },
    async getFirestoreTeams(){

      // Performance
      if(!this.teams.length || this.isTeamAdded){

        this.teams = []
        this.showSpinner = true

        const q = query(collection(db, 'teams'))
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
          this.teams.push(doc.data())
        });

        this.showSpinner = false
        this.isTeamAdded = false
      }

    },
    async getDataByUrlTeam(urlTeam){

        this.showSpinner = true

        let obj_conf = {}
        let brand_color = '#466b73'
        const url_team = urlTeam

        // Obj Default
        obj_conf = {
          team_name: 'I am',
          team_desc: 'Sharing',
          team_icon: '/images/sharing-icon.png',
          team_color: brand_color,
          url_team: url_team,
          bgImage: '',
          bgBodyImage: ''
        }

        if(url_team){
          const docRef = doc(db, "teams", url_team);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {

            const data = docSnap.data()

            obj_conf = {
               team_name: data.team_name,
               team_desc: data.team_desc,
               team_icon: data.team_icon,
               team_color: data.team_color,
               url_team: url_team,
               bgImage: data.bgImage,
               bgBodyImage: data.bgBodyImage
             }

          } else {
            // console.log('no existe url_team en FB')
          }
        }else{
          // console.log('url_team undefined')
        }

        setCssVar('primary',String(obj_conf.team_color))

        this.conf_team = obj_conf

        LocalStorage.set('team_name', this.conf_team.team_name)
        LocalStorage.set('url_team', this.conf_team.url_team)
        LocalStorage.set('folder_name', this.folder_name)

        this.showSpinner = false

    },
    async queryFolders(paramsTeam){

      this.showSpinner = true

      this.allFolders = []
      this.folders = []

      const q = query(collection(db, paramsTeam))
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        this.allFolders.push(doc.data())
        this.folders.push(doc.data())
      });

      this.showSpinner = false

    },
    async getFileFromFirestore(url_team, folder_name, file){

      const docRef = doc(db, url_team, folder_name, 'files', file);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        this.viewFile = docSnap.data();
      } else {
        console.log("No such document!");
      }

      this.showSpinner = false

    },
    async firestoreAddFiles(data){

      this.showSpinner = true

      try {

        await setDoc(doc(db, this.conf_team.url_team, data.folder_name, 'files', data.id), {
          additionalNote : data.initComment,
          url: data.file,
          user: data.user,
          uid: data.uid,
          fileName: data.fileName,
          fileDate: Date.now(),
          fileType: data.fileType,
          id: data.id,
          orden:'0'
        });
        this.showNotifySuccess(data.fileName+' added, you can add another file')
      } catch (error) {
        this.showNotifyFailled(error)
      }

    },
    async prevFirestoreFolderNameQuery(url_team, folder_name, param_file){

      this.showSpinner = true

      //**LINK WEB SIGUEÑAL**
      this.isFolder = false

      // BUSCAMOS FOLDER NAME
      // Limpiamos lista de files
      this.firestoreFolderNameData = {}

      this.set_url_team(url_team)

      this.set_folder_name(folder_name)

      // console.log(url_team, folder_name)
      const q = query(doc(db, url_team, folder_name))

      const docSnap = await getDoc(q);

        if (docSnap.exists()) {
              /** WITH PASS**/
              let dataFolder = docSnap.data()

                if(dataFolder.withPass&&!this.passOk){

                  this.pass = dataFolder.autoPass

                  // IS FILE OR FOLDER
                  if(param_file){
                    this.router.push('/'+url_team+'/withPass/'+param_file)
                  }else{
                    this.router.push('/'+url_team+'/withPass/folder')
                  }
                  // END IS FILE OR FOLDER

                }else{
                  this.pass = null
                }

                // READ FIRESTORE
                if(param_file){

                  this.isFolder = false
                  this.getFileFromFirestore(url_team, folder_name, param_file)

                }else{

                  this.isFolder = true
                  this.firestoreFolderNameQuery(folder_name)

                }
                // END READ FIRESTORE

        } else {

          this.isFolder = false
          this.router.push('/nothing')

        }

    },
    async firestoreFolderNameQuery(data){

      const url_team = this.conf_team.url_team
      // console.log('url_team: ',url_team)

      // Firebase 9
      const self = this

      const q = query(collection(db, url_team, data, 'files'))

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        let arr = []

        if(!querySnapshot.empty){

          querySnapshot.forEach((doc) => {
            arr.push(doc.data());
          });

          arr.sort(function (a, b) {if (a.orden > b.orden) {return 1;}if (a.orden < b.orden) {return -1;}return 0;})

          this.firestoreFolderNameData = arr

        }else{
          // console.log('else Folder Name query')
        }

      });

      this.showSpinner = false
      // End Firebase 9

    },
    async updateTeam(){

      // console.log('this.conf_team ',this.conf_team);
      // return

      this.showSpinner = true

      const docRef = doc(db, 'teams', this.conf_team.url_team);

      try {
        await updateDoc(docRef, this.conf_team)
        this.store.isTeamAdded = true
        this.showNotifySuccess(this.conf_team.team_name+' updated')
        this.router.push('/'+this.conf_team.url_team+'/folders')
      } catch (error) {
        this.showNotifyFailled(error)
      }

    },
    showNotifySuccess (msj) {
      this.showSpinner = false
      Notify.create({
        message: msj,
        color: 'positive',
        timeout: 2000
      })
    },
    showNotifyFailled (error) {
      this.showSpinner = false
      Notify.create({
        message: error,
        color: 'negative',
        timeout: 2000
      })
    }
  }
});
