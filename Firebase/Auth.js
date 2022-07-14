import firebase from "./Initial";
import 'firebase/firestore';
import 'firebase/auth';

class Auth{
 constructor() {
   this.auth = firebase.auth()
  }

  createAccount=(email,password,success,unsuccess)=>{
    this.auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential)=>{
      var user = userCredential.user
      success(user)
    })
    .catch((error)=>{
      unsuccess(error)
    })
  }

  signIn=(email,password,success,unsuccess)=>{
    this.auth.signInWithEmailAndPassword(email,password)
    .then((userCredential)=>{
      var user = userCredential.user;
      success(user)
    })
    .catch((error)=>{
      unsuccess(error)
    });
  }
  
  signOut=(success,unsuccess)=>{
    this.auth.signOut()
    .then(()=>{
      success()
    })
    .catch((error)=>{
      unsuccess(error)
    })
  }

  sendPassword=(email,success,unsuccess)=>{
    this.auth.sendPasswordResetEmail(email)
    .then(() => {
      success()
    })
    .catch((error) => {
      unsuccess(error)
    });
  }

  setNewPassword=(oldPassword,newPassword,success,unsuccess)=>{
    const user = this.auth.currentUser;
    const email = user.email
     this.auth.signInWithEmailAndPassword(email,oldPassword)
    .then((userCredential)=>{

        user.updatePassword(newPassword)
        .then(() => {
          success()
        })
        .catch((error) => {
          unsuccess(error)
        });
        
    })
    .catch((error)=>{
      unsuccess(error)
    });
  }

  getCurrentUser=()=>{
    const user = this.auth.currentUser;
    return user;
  }
  

}

const auth = new Auth()
export default auth
