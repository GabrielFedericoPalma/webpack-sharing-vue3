export default {
  methods: {
    isImg(fileType) {
      return fileType == 'image/png' || fileType == 'image/jpeg' || fileType == 'image/svg+xml'
    },
    isPdf(fileType){
      return fileType == 'application/pdf'
    },
    isVideo(fileType){
      return fileType == 'video/mp4'
    },
    isZip(fileType){
      return fileType == 'application/zip' || fileType == 'application/x-7z-compressed' || fileType == 'application/x-tar' || fileType == 'application/x-rar-compressed'
    }
  }
}
