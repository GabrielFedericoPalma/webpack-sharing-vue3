import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { firebase_db_store } from 'stores/firebase_db_store.js'

export default {
  data(){
    return {
      store: firebase_db_store()
    }
  },
  methods: {
    textToGuion(value){
      return value.replace(/\s/g, "-").toLowerCase()
    },
    uploadFile(event){

      var self = this

      self.store.showSpinner = true

      var file = event.target.files[0]
      this.fileName = file.name
      this.fileType = file.type

      let url_team = self.textToGuion(this.store.conf_team.team_name).trim()

      const storage = getStorage();
      const storageRef = ref(storage, url_team+'/'+this.fileName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {

        },
        (error) => {
          self.store.showSpinner = false
          self.store.showNotifyFailled(error)
        },
        () => {

          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              // console.log('File available at', downloadURL);
              self.uploadedFile = downloadURL;
              self.store.showNotifySuccess(self.fileName+' uploaded (Click Save)')
          });
        }
      );

    }
  }
}
