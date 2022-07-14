import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,Modal,Alert,ScrollView,Linking,Image
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

class Full extends Component {
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
            driverID:null
    };
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
                    this.props.navigation.navigate('Home')
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
        console.log('here i come',route.params.chatorder)
        const chatorder=route.params.chatorder

        this.props.chat(chatorder)
        this.props.navigation.navigate('Chat');
      
  }
    cancel=()=>{
        console.log('cancel press')
        this.showAlertCancel()


    }
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
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
    componentDidMount=()=>{
      const {route} =this.props
        
        const id=route.params.orderid
        const fieldid=route.params.fieldid
        const driverid=route.params.driverid
        console.log('this id',id)
        
        this.db.collection("orders").where("id","==",fieldid)
        .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log('tumrai')
            if(doc.data().status=="matched")
            {
                
                this.setState({statusOrder:"รับงานเรียบร้อย"})  
            }
            else if(doc.data().status=="success"){
              this.setState({statusOrder:"เสร็จสิ้น"})
              RootNavigation.navigate('Home');
            }
            else if(doc.data().status=="cancel"){
              this.setState({statusOrder:"ยกเลิก"})
              RootNavigation.navigate('Home');
            }
        });
        
    });
        var num =null
        let arr=[]

       // console.log('order from matching',this.props.order)
        var docRef = this.db.collection("orders").doc(id);

        docRef.get().then((doc) => {
            if (doc.exists) {
                num= doc.data().gnome.length
                console.log('num',num)
                let order = doc.data()
                this.setState({uid:order.customerID})
                this.setState({gettime:order.getTime})
                this.setState({order:order})
                this.setState({price:order.price})
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
                }
                this.setState({ markerArr: this.state.markerArr.concat(arr)})
                let a =this.state.markerArr
                var uniqe = a.filter(this.onlyUnique)
                this.setState({ markerArr: uniqe} )
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
              this.setState({phoneNumber:doc.data().phone})
              this.setState({driverName:name})
              this.setState({image:img})
              this.setState({bank:doc.data().bank})
              this.setState({bankno:doc.data().bankno})
              this.setState({carid:doc.data().carid})
              this.setState({driverID:doc.id})
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
    renderTime=(time)=>{
      console.log('time',time)
      
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
    const { navigation } = this.props;
    const { modalVisible ,check1,check2,check3,check4,check5} = this.state;
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container2}>
        
        <View style={{flex:1}}>
          <TouchableOpacity style={{paddingTop:20,alignItems:'flex-end'}} onPress={()=>this.cancel()}>
                          <
                              Text>ยกเลิก</Text>
          </TouchableOpacity>
          <Text>คำสั่ง :{id}</Text>
          <Text>สถานะ :{this.state.statusOrder}</Text>
                <View style={{flex:1 ,flexDirection:'row',alignItems:'center',marginTop:30,marginLeft:20}}>
                  
                      
                                <Image source={{ uri:this.state.image }} style={styles.image} />
                                <Text> {this.state.driverName}</Text>
                        <TouchableOpacity style={{marginLeft:10}}
                        
                        
                        onPress={this.onPressChat}>
                          <Ionicons name="ios-chatbubble-sharp" size={24} color="black" style={styles.callTxt} />
                      </TouchableOpacity >

                      <TouchableOpacity style={{marginLeft:10}} onPress={()=> this.call()}>
                                  <Ionicons name="ios-call" style={styles.callTxt}/>
                                </TouchableOpacity>   
                </View>
                <View style={{flex:1,flexDirection:'row'}}>
                  <View style={{flex:1,flexDirection:'column',marginLeft:100}}>
                    <Text>{this.state.bank}</Text>
                    <Text>{this.state.bankno}</Text>
                  </View>
                  <View style={{flex:1,flexDirection:'column'}}>
                    <Text>{this.state.phoneNumber}</Text>
                    <Text>{this.state.carid}</Text>
                  </View>
                  
                  
                </View>
                
        </View>
        <View style={{flex:1}}>
        <MapView  style={{width:'100%', height:'100%'}}
                        region={order.wayPointList[0].region}
                    >
                           {this.state.markerArr.map((marker, index) => (
                            <MapView.Marker
                              key={`${index}`}
                              coordinate={marker.latlng}
                              title={marker.title}
                              
                            />
                          ))}
                      
                        
          </MapView>
        </View>
          
                    
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.content}>
          
          
                    
                    
                    <View style={styles.centeredView}>
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => {
                        
                        this.setModalVisible(!modalVisible);
                      }}
                    >
                        <CheckBox
                        title='รอนานเกินไป'
                        checked={check1}
                        onPress={()=>{this.setState({check1data:'รอนานเกินไป'}),this.setState({check1:!check1})}}
                        />
                        <CheckBox
                        title='ต้องการแก้ไขคำสั่ง'
                        checked={check2}
                        onPress={()=>{this.setState({check2data:'ต้องการแก้ไขคำสั่ง'}),this.setState({check2:!check2})}}
                        />
                        <CheckBox
                        title='ไม่ต้องการสั่งอีกต่อไป'
                        checked={check3}
                        onPress={()=>{this.setState({check3data:'ไม่ต้องการสั่งอีกต่อไป'}),this.setState({check3:!check3})}}
                        />
                        <CheckBox
                        title='คนขับบอกให้ยกเลิก'
                        checked={check4}
                        onPress={()=>{this.setState({check4data:'คนขับบอกให้ยกเลิก'}),this.setState({check4:!check4})}}
                        />
                        <CheckBox
                        title='ไม่สามารถติดต่อคนขับได้'
                        checked={check5}
                        onPress={()=>{this.setState({check5data:'ไม่สามารถติดต่อคนขับได้'}),this.setState({check5:!check5})}}
                        />
                        <TextInput style={styles.textInput}  placeholder="เหตุผลอื่น ๆ"  onChangeText={txt=>{this.setState({other:txt})}}>
                            
                        </TextInput>
                        <TouchableOpacity onPress={()=>this.cancelWork()}>
                            <Text>ยืนยัน</Text>
                        </TouchableOpacity>
                    </Modal>
                
                    </View>
              <Text>เวลารับสินค้า  {this.renderTime(this.state.gettime)}</Text>
              <Text>ราคารวม   {this.state.price}    บาท</Text>
              <TouchableOpacity 
                style={styles.buttonLogin} 
                onPress={this.onChangePress}>
                  <Text style={{fontSize:16, color:'white'}}>แนบรูปสลิป</Text>
              </TouchableOpacity>

              

          </View>
        </View>
        
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  buttonLogin: {
    
   justifyContent:"center",
    alignItems: "center",
    backgroundColor: "#6b4683",
    marginBottom:8,
    padding:8
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
    flex: 1
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
      borderColor: 'pink',
      borderWidth: 1,
      paddingStart:20,
      marginBottom:8,
      padding:8,
      fontSize:16,
      color:'pink'
    },
    image: {
      borderColor: '#6b4683',
      borderWidth: 1,
      width: 100,
      height: 100,
      marginBottom:8,
      borderRadius:50
  
    },
    callTxt:{
      backgroundColor:"#42b883",
      padding:10,
      borderRadius:30,
      width:60,
      textAlign:"center",
      color:"#fff",
      fontSize:30
    }
});


const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => {
  return{
  chat: (id) => dispatch(startChat(id)),
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Full);