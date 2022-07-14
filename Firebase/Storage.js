import firebase from 'firebase'
import 'firebase/storage'


  class Storage{
    constructor(){
      
      this.storage = firebase.storage();
    }
  
    upload=async(uri,fileName,running,success,unsucess)=>{
      const response = await fetch(uri)
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function() {
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });
  
    
      
      var metadata = {
        contentType: 'image/jpeg',
      };
  
      var uploadTask = this.storage.ref().child('Bill/'+`${fileName}`).put(blob,metadata)
      uploadTask.on('state_changed'
      ,(snapshot)=>{
        var progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
        running(progress)
      }
      ,(error)=>{
        unsucess(error)
      }
      ,()=>{
        blob.close();
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL)=>{
          console.log('downloadURL',downloadURL)
          success(downloadURL)
        }).catch(function(error){
          console.log(error)
        })
      })
    }
  
  
  }
  const storage = new Storage()
  export default storage