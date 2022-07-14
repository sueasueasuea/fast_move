import React, {Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,Modal,Alert,ScrollView,Linking,Image,LogBox
} from 'react-native';
import firebase from "../Firebase/Initial";
import 'firebase/firestore';
import { CheckBox } from 'react-native-elements';
import * as RootNavigation from '../src/RootNavigation.js';
import auth from '../Firebase/Auth'
import { Ionicons } from "@expo/vector-icons"
import MapView from 'react-native-maps'
import { connect } from 'react-redux';
import {startChat} from '../actions/Users'
import firestore from '../Firebase/Firestore'
import storage from '../Firebase/Storage'
import * as ImagePicker from 'expo-image-picker'; 
LogBox.ignoreLogs(['source.uri should not be an empty string']);
import { NavigationActions,StackActions  } from 'react-navigation';
import carpin from '../assets/pin.png';
import placepin from '../assets/placeholder.png';

// const resetAction = StackActions .reset({
//   index: 0,
//   actions: [NavigationActions.navigate({ routeName: 'Home' })],
// });
const car_pin = Image.resolveAssetSource(carpin).uri;
const place_pin = Image.resolveAssetSource(placepin).uri;

class Matched extends Component {
  constructor(props){
    super(props);
     this.db = firebase.firestore()
     this.state = {
      modalVisible: false,
            other:null,
            check1:false,
            check1data:null,
            check2data:null,
            check3data:null,
            check4data:null,
            check5data:null,
            check2:false,
            check3:false,
            check4:false,
            check5:false,
            markerArr:[],
            order:null,
            statusOrder:'loading',
            phoneNumber:'',
            driverName:'',
            image:null,
            bank:'loading',
            bankno:'loading',
            carid:'loading',
            gettime:'loading',
            price:'loading',
            uid:null,
            driverID:null,
            imageBill:null,
            uploadURI:null,
            orderID:null,
            modalVisible2:false,
            realLocation:{
              latitude:0,longitude:0
            },
            
            medLoc: {
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0,
              longitudeDelta: 0,
            }
            
    };
    this._isMounted=false;
    
  }

  
  call=()=>{
    const { phoneNumber } = this.state

    Linking.openURL(`tel:${phoneNumber}`)
  }
  checkNull=(list)=>{
    return list!=null
  }
  
  cancelWork(){
    const{
        other,
        check1data,
        check2data,
        check3data,
        check4data,
        check5data,
        modalVisible
    }=this.state
    console.log(this.state.check1)
    var allrns=[other,
        check1data,
        check2data,
        check3data,
        check4data,
        check5data]
    
    var result=allrns.filter(this.checkNull)
    console.log(allrns)
    
    
    const {route} =this.props
    const id=route.params.orderid
    
    var docRef = this.db.collection("orders").doc(id);

        docRef.get().then((doc) => {
            if (doc.exists) {
                this.db.collection("orders").doc(id).set({
                    
                    status: "cancel",   
                    reasons: result
                    
                },{merge:true})
                .then(() => {
                    //this.CancelSuccess()
                    this.setModalVisible(!modalVisible);
                    console.log("Document successfully written!");
                    this.props.navigation.navigate('Home');
                    result=null
                })
                .catch((error) => {
                    //this.Unsuccess()
                    console.error("Error writing document: ", error);
                });
                //console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    
  }

  onPressChat=()=>{
        const {route} =this.props
        console.log('here i come',route.params.order)
        const order=route.params.order

        this.props.chat(order.chat)
        this.props.navigation.navigate('Chat');
      
  }
    cancel=()=>{
        console.log('cancel press')
        this.showAlertCancel()


    }
    // onRegionChange=(region)=> {
    //   var{medLoc}=this.state;
    //   medLoc.timing({
    //     latitude:  region.latitude, // selected marker lat
    //     longitude: region.longitude, // selected marker lng
    //   }).start();
    // }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
      }
      setModalVisible2=(visible)=>{
        this.setState({ modalVisible2: visible });
      }
    onlyUnique=(value, index, self) =>{
        return self.indexOf(value) === index;
    }
    showAlertCancel(){  
      const{modalVisible}=this.state
      console.log('alert come')
      Alert.alert(  
        'Are you sure to cancel this order',  
          '',  
          [  
                
                {text: 'Yes', onPress: () => this.setModalVisible(!modalVisible)}, 
                {text: 'No', onPress: () => console.log('No Pressed')} 
          ]  
      );  
    } 

    showAlertSuccess(){  
      
      console.log('alert come')
      Alert.alert(  
        'Your Order has success',  
          'Do u want to go back home ?',  
          [  
                
                {text: 'Yes', onPress: () => this.props.navigation.navigate("Home")}, 
                {text: 'No', onPress: () => console.log('No Pressed')} 
          ]  
      );  
    } 


    componentWillUnmount=()=>{
     this._isMounted=false;
     this.statusListener();
    }
    componentDidMount=()=>{
      this._isMounted=true;
      const {route} =this.props
        
        const id=route.params.orderid
        if(this._isMounted===true){
          this.setState({orderID:id})
        }
        
        const fieldid=route.params.fieldid
        const driverid=route.params.driverid
        console.log('this id',id)
        
        this.statusListener=this.db.collection("orders").where("id","==",fieldid)
        .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log('tumrai')
            if(doc.data().status=="matched")
            {
              if(this._isMounted===true){
                this.setState({statusOrder:"รับงานเรียบร้อย"})  
              }
            }
            else if(doc.data().status=="success"){
              if(this._isMounted===true){
              this.setState({statusOrder:"เสร็จสิ้น"})
              }
              this.showAlertSuccess()
            }
            else if(doc.data().status=="cancel"){
              if(this._isMounted===true){
              this.setState({statusOrder:"ยกเลิก"})
              }
              //RootNavigation.navigate('Home');
            }
        });
        
    });
    
    setInterval(()=>{
      console.log('interval 6 s')
      const dbRef = firebase.database().ref();
          dbRef.child("users").child(driverid).get().then((snapshot) => {
            if (snapshot.exists()) {
              console.log(snapshot.val());
              let data = snapshot.val()
              if(this._isMounted===true)
              {

                this.setState({realLocation:data})
                console.log('state realLocation',this.state.realLocation)
              }
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });
    },6000)
          
        var num =null
        let arr=[]
        let medLatitude=0
        let medLongitude =0 
        let medLatitudeDelta=0
        let medLongitudeDelta=0

       // console.log('order from matching',this.props.order)
        var docRef = this.db.collection("orders").doc(id);

        docRef.get().then((doc) => {
            if (doc.exists) {
                num= doc.data().gnome.length
                console.log('num',num)
                let order = doc.data()
                if(this._isMounted===true){
                this.setState({uid:order.customerID})
                this.setState({gettime:order.getTime})
                this.setState({order:order})
                this.setState({price:order.price})
                }
                //console.log(num)
                //console.log(order.wayPointList[0].region)
                for(let i=0 ;i<num;i++)
                {
                    arr.push(
                      {
                        latlng:{latitude:order.wayPointList[i].region.latitude,
                          longitude:order.wayPointList[i].region.longitude},
                        title:`จุดที่ ${i+1}`
                      }
                      
                    
                        
                    )
                    medLatitude=medLatitude+order.wayPointList[i].region.latitude
                    medLongitude=medLongitude+order.wayPointList[i].region.longitude
                    medLatitudeDelta=medLatitudeDelta+order.wayPointList[i].region.latitudeDelta
                    medLongitudeDelta=medLongitudeDelta+order.wayPointList[i].region.longitudeDelta
                }
                let medLoc={
                  latitude:medLatitude/num,longitude:medLongitude/num,latitudeDelta:0.01,longitudeDelta:0.01
                }
                if(this._isMounted===true){
                  this.setState({ medLoc: medLoc} )
                }
                if(this._isMounted===true){
                this.setState({ markerArr: this.state.markerArr.concat(arr)})}
                let a =this.state.markerArr
                var uniqe = a.filter(this.onlyUnique)
                if(this._isMounted===true){
                this.setState({ markerArr: uniqe} )
                }
              } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        let name=''
        var driverRef=this.db.collection("users").doc(driverid)
        driverRef.get().then((doc) => {
          if (doc.exists) {
              console.log('tumaiiiii')
              let first = doc.data().firstname
              let last = doc.data().lastname
              //console.log(first)
              //console.log(last)
              let img = doc.data().image
              
              name=first+"    "+last
              console.log('name',name)
              if(this._isMounted===true){
              this.setState({phoneNumber:doc.data().phone})
              this.setState({driverName:name})
              this.setState({image:img})
              this.setState({bank:doc.data().bank})
              this.setState({bankno:doc.data().bankno})
              this.setState({carid:doc.data().carid})
              this.setState({driverID:doc.id})}
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch((error) => {
          console.log("Error getting document:", error);
      });
    //   firestore.addMessageRoom(
    //     (id) => {
    //       this.props.chat(id)
    //       console.log('id in redux',this.props.user.id)
    //       firestore.addChat(
    //         doc.id,
    //         id,
    //         () => {},
    //         (error) => {}
    //       );

          
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   )
     }
     showImage=()=>{
      this.setModalVisible2(!this.state.modalVisible2)
     }
     
    storageUpload=()=>{
          
      storage.upload(this.state.imageBill,this.state.orderID,this.running,this.uploadSuccess,this.uploadUnsuccess)
    }
    pickImage=async()=>{
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:ImagePicker.MediaTypeOptions.All,
        allowsEditing:false,
        quality:1
      });

      if(!result.cancelled){
        this.setState({imageBill:result.uri});
        this.storageUpload()
      }
    }
    running=(progress)=>{
      console.log(progress);
    }

    uploadSuccess=(url)=>{
      
      console.log(url)
      this.setState({uploadURI:url})
      
      this.uploadImage()
    }

    uploadUnsuccess=(error)=>{
      console.log(error)
    }
    uploadImage=()=>{
      console.log('id from state and uploadImage',this.state.id)
      
      console.log('state  : ',this.state.uploadURI)
      firestore.uploadImage(this.state.orderID,this.state.uploadURI,this.updateSuccess,this.updateUnsuccess)
    }
    updateSuccess=()=>{
      console.log('successful upload image')
      
    }

    updateUnsuccess=(error)=>{
      console.log(error)
    }


    renderTime=(time)=>{
      //console.log('time',time)
      
        let tempdate = new Date(time.seconds*1000+ time.nanoseconds / 1000000)
         var date =tempdate.getDate()
         var month = tempdate.getMonth()+1
         var years = tempdate.getFullYear()
        var hour = tempdate.getHours()
        var minute = tempdate.getMinutes()
        if (hour < 10){
          hour = '0'+hour
        }
        
        if (minute < 10){
          minute = '0'+minute
        }
        return `${date}/${month}/${years}    ${hour}:${minute}`
        //return tempdate
    }
  render(props) {
    const {route} =this.props
      const id=route.params.orderid
     
      const order=route.params.order
      var imgBill=route.params.order.imageBill
          const { navigation } = this.props;
    const { modalVisible2,modalVisible ,check1,check2,check3,check4,check5} = this.state;
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container2}>
        
        <View style={{flex:1}}>
          <TouchableOpacity style={{marginTop:25,marginRight:5,justifyContent:'center',alignItems:'center',alignSelf:'flex-end',backgroundColor:'#E63946',borderRadius:20,width:50}} onPress={()=>this.cancel()}>
                          <Text style={{color:'white'}}>ยกเลิก</Text>
          </TouchableOpacity>
          <Text style={{paddingLeft:10}}>คำสั่ง :{id}</Text>
          <Text style={{paddingLeft:10}}>สถานะ :{this.state.statusOrder}</Text>
              <View style={{flex:1,flexDirection:'row'}}>
                <View style={{flex:1 ,flexDirection:'column',justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                  
                      
                  <Image source={{ uri:this.state.image }} style={styles.image} />
                                
                  <Text style={{}}> {this.state.driverName}</Text>
                </View>
                
                <View style={{flex:1,flexDirection:'column',backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                  
                  <View style={{paddingRight:10}}>
                    <Text>{this.state.bank}</Text>
                    <Text>{this.state.bankno}</Text>
                  </View>
                  
                  <Text style={{}}>ทะเบียนรถ: {this.state.carid}</Text>
                </View>
                <View style={{flex:1,flexDirection:'column',backgroundColor:'white',justifyContent:'center',alignItems:'center'}}>
                  <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',paddingRight:5}}>
                    <TouchableOpacity style={{marginLeft:10}}
                      onPress={this.onPressChat}>
                      <Ionicons name="ios-chatbubble-sharp" size={24} color="black" style={styles.callTxt} />
                    </TouchableOpacity >

                    <TouchableOpacity style={{marginLeft:10}} onPress={()=> this.call()}>
                      <Ionicons name="ios-call" style={styles.callTxt}/>
                    </TouchableOpacity>  
                  </View>
                </View>
                  
              </View>
                
                
        </View>
        <View style={{flex:1}}>
        <MapView  key={this.state.realLocation.longitude.length}  style={{width:'100%', height:'100%'}}
                        region={this.state.medLoc}
                        
                        
                        
                    >
                           {this.state.markerArr.map((marker, index) => (
                            <MapView.Marker
                              key={`${index}`}
                              coordinate={marker.latlng}
                              title={marker.title}
                              
                              >
                              <Text>{marker.title}</Text>
                              <Image source={{uri:place_pin}}
                              style={{width: 30, height: 30}}></Image>
                              </MapView.Marker>
                              
                           
                          ))}
                          <MapView.Marker
                            pinColor={'green'}
                            key={this.state.realLocation.longitude.length}
                            coordinate={this.state.realLocation}
                            title={"คนขับ"}
                          >
                            <Text>คนขับ</Text>
                            <Image source={{uri:car_pin}}
                              style={{width: 30, height: 30}}></Image>
                          </MapView.Marker>
                      
                        
          </MapView >
        </View>
          
                    
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={styles.content}>
                            
          
                    
                    
                    <View style={styles.centeredView}>
                    <Modal
                      animationType="slide"
                      transparent={false}
                      visible={modalVisible2}
                      onRequestClose={() => {
                        
                        this.setModalVisible2(!modalVisible2)
                      }}
                    >
                        <Image source={{ uri:(this.state.uploadURI ? this.state.uploadURI:imgBill )}} style={styles.imageBill} />
                    </Modal>
                    <Modal
                            animationType="slide"
                            transparent={false}
                            visible={modalVisible}
                            onRequestClose={() => {
                              
                              this.setModalVisible(!modalVisible);
                            }}
                          >
                              <CheckBox 
                              containerStyle={styles.checkBox}
                              title='รอนานเกินไป'
                              checked={check1}
                              uncheckedColor="#FFFFFF"
                              checkedColor="blue"
                              onPress={()=>{this.setState({check1data:'รอนานเกินไป'}),this.setState({check1:!check1})}}
                              />
                              <CheckBox
                              containerStyle={styles.checkBox}
                              title='ต้องการแก้ไขคำสั่ง'
                              checked={check2}
                              uncheckedColor="#FFFFFF"
                              checkedColor="blue"
                              onPress={()=>{this.setState({check2data:'ต้องการแก้ไขคำสั่ง'}),this.setState({check2:!check2})}}
                              />
                              <CheckBox
                              containerStyle={styles.checkBox}
                              title='ไม่ต้องการสั่งอีกต่อไป'
                              checked={check3}
                              uncheckedColor="#FFFFFF"
                              checkedColor="blue"
                              onPress={()=>{this.setState({check3data:'ไม่ต้องการสั่งอีกต่อไป'}),this.setState({check3:!check3})}}
                              />
                              <CheckBox
                              containerStyle={styles.checkBox}
                              title='คนขับบอกให้ยกเลิก'
                              checked={check4}
                              uncheckedColor="#FFFFFF"
                              checkedColor="blue"
                              onPress={()=>{this.setState({check4data:'คนขับบอกให้ยกเลิก'}),this.setState({check4:!check4})}}
                              />
                              <CheckBox
                              containerStyle={styles.checkBox}
                              title='ไม่สามารถติดต่อคนขับได้'
                              checked={check5}
                              uncheckedColor="#FFFFFF"
                              checkedColor="blue"
                              onPress={()=>{this.setState({check5data:'ไม่สามารถติดต่อคนขับได้'}),this.setState({check5:!check5})}}
                              />
                              <TextInput style={styles.textInput}  placeholder="เหตุผลอื่น ๆ"  onChangeText={txt=>{this.setState({other:txt})}}>
                                  
                              </TextInput>
                              <TouchableOpacity style={{borderRadius:20,height:40,width:100,backgroundColor:'#457B9D',justifyContent:'center',alignItems:'center',marginLeft:150,}} onPress={()=>this.cancelWork()}>
                                  <Text style={{color:'white'}}>ยืนยัน</Text>
                              </TouchableOpacity>
                          </Modal>
                
                    </View>
              <Text>เวลารับสินค้า  {this.renderTime(this.state.gettime)}</Text>
              <Text>ราคารวม   {this.state.price}    บาท</Text>
              <View style={{flexDirection:'row',justifyContent:'space-between',paddingTop:15}}>
                    <TouchableOpacity 
                      style={styles.buttonLogin} 
                      onPress={this.pickImage}>
                        <Text style={{fontSize:16, color:'white'}}>แนบรูปสลิป</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.buttonLogin} 
                      onPress={this.showImage}>
                        <Text style={{fontSize:16, color:'white'}}>แสดงรูปชำระเงิน</Text>
                    </TouchableOpacity>
              </View>
              

              

          </View>
        </View>
        
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  checkBox:{
    backgroundColor:'#A8DADC',
    justifyContent:'center',
    
  },
  buttonLogin: {
    
   justifyContent:"center",
    alignItems: "center",
    backgroundColor: "#457B9D",
    padding:8,
    margin:8,
    borderRadius:20
  },
  textInput:{
    borderColor: '#6b4683',
    borderWidth: 1,
    paddingStart:20,
    marginBottom:8,
    padding:8,
    fontSize:16,
    color:'#6b4683'
  },
  content:{
    padding:16,
    margin:16,
    width:"90%"
  },
  container2: {
    flex: 1,
    backgroundColor:'#F1FAEE'
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
      
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    bottom: 50,
  },
  centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    textInput:{
      borderColor: '#457B9D',
      borderWidth: 1,
      paddingStart:15,
      marginBottom:8,
      padding:8,
      fontSize:14,
      color:'#457B9D',
      marginHorizontal:10,
      height:40
    },
    image: {
      borderColor: '#1D3557',
      borderWidth: 1,
      width: 100,
      height: 100,
      marginBottom:8,
      borderRadius:50
  
    },
    callTxt:{
      backgroundColor:"#457B9D",
      padding:10,
      borderRadius:30,
      width:60,
      textAlign:"center",
      color:"#fff",
      fontSize:30
    },
    imageBill: {
      borderColor: '#6b4683',
      flex: 1,
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
     
      
  
    },
    
});


const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => {
  return{
  chat: (id) => dispatch(startChat(id)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Matched);