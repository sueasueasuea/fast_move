import firebase from "./Initial";
import 'firebase/firestore';

class Firestore{
 constructor() {
   this.db = firebase.firestore();
   
  }
  
  addUser=(id,item,success,unsuccess)=>{
    item.time = firebase.firestore.FieldValue.serverTimestamp();

    item.role = "customer"
    item.profileimage= ''
    item.status = 1
    item.carid = ''

    console.log(item)
    
    this.db
      .collection('users')
      .doc(id)
      .set(item)
      .then(success())
      .catch(function (error) {
        unsuccess(error);
      });
  }

  getUser=(id,success,unsuccess)=>{
    var docRef = this.db.collection('users').doc(id);
    docRef
    .get()
    .then((doc)=>{
      success(doc.data())
    })
    .catch((error)=>{
      unsuccess(error)
    })

  }

  saveOrder=(item,success,unsuccess)=>{ 
    item.time = firebase.firestore.FieldValue.serverTimestamp();
    item.getTime = firebase.firestore.Timestamp.fromDate(new Date(item.getTime))
    item.imageBill =""
    console.log('getTime in saveOrder',item.getTime)
    var orderRef = this.db.collection("orders");
    var query = orderRef.orderBy("time","desc").limit(1)
    query.get()
    .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              item.id = doc.data().id+1
              console.log(item)
              this.db
              .collection('orders')
              .add(item)  
              .then(success(item.id))
              .catch(function (error) { 
                unsuccess(error);
              });
          });
            
          
          
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });

    
  }
  addMessageRoom=(pass,fail)=>{
    var docRef = this.db.collection('message').add({}).then((doc)=> pass(doc.id)).catch((error)=>fail(error));
    /*
    var docRef = this.db.collection('message').doc();
    docRef.set({});
    console.log('CHAT ID : '+docRef.id);
    pass(docRef.id);
    */
  }
  addChat = (id, data, pass, fail) => {
    console.log(data);
    var docRef = this.db
      .collection('orders')
      .doc(id)
      .update({ chat:data  })
      .then(() => {pass()})
      .catch((error) => {fail(error)});
  };

  sendMessage = (id, sender, message, pass, fail) => {
    var docRef = this.db.collection('message').doc(id).collection('messages');
    var messageData = {
      sender: sender,
      message: message,
      time: firebase.firestore.FieldValue.serverTimestamp(),
    };
    docRef
      .add(messageData)
      .then((doc) => {
        pass(doc.id);
      })
      .catch((error) => {
        fail(error);
      });
  };

  listeningMessage = (id, pass) => {
    var docRef = this.db
      .collection('message')
      .doc(id)
      .collection('messages')
      .orderBy('time', 'asc');
    docRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          pass(change.doc.data());
        }
      });
    });
  };
  uploadImage=(id,data,success,unsuccess)=>{
    console.log(id)
    var ref = this.db.collection('orders').doc(id);
    ref
    .update({
      imageBill:data
    })
    .then(()=>{
      success();
    })
    .catch((error)=>{
      unsuccess(error)
    });
  }


}

const firestore = new Firestore()
export default firestore
