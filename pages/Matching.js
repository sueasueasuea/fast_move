//Matching.js
import {View,Text,StyleSheet,ScrollView,TouchableOpacity,Modal,Alert,Image} from 'react-native';
import React,{Component} from "react";
import Marker from 'react-native-maps';
import MapView from 'react-native-maps'
import { connect } from 'react-redux';

import firebase from "../Firebase/Initial";
import 'firebase/firestore';
import { CheckBox } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import firestore from '../Firebase/Firestore';
import {startChat} from '../actions/Users'
import Loading from './Loading'
import placepin from '../assets/placeholder.png';

const place_pin = Image.resolveAssetSource(placepin).uri;



class Matching extends Component{
    constructor(props){
        super(props);
       
        this.db = firebase.firestore()
        //this.matchListen=this.db.collection("orders").where("id", "==", this.id)
        this.state = {
            loading:true,
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
            order:null
        };
      this._isMounted=false;   
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
      componentWillUnmount=()=>{
        this.matchingListener();
      }
    componentDidMount=()=>{
      this._isMounted=true;
        const {route} =this.props
        const id=route.params.orderid
        const fieldid=route.params.fieldid
        console.log('this id',id)
        this.matchingListener=this.db.collection("orders").where("id","==",fieldid)
        .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            console.log('tumrai')
            if(doc.data().status=="matched")

            {  if(this._isMounted===true){
              this.setState({loading:false})
              }
               
                console.log('driver id:' ,doc.data().driverID)
                
                this.props.navigation.navigate('Matched',{order:doc.data(),orderid:id,fieldid:fieldid,driverid:doc.data().driverID})
                
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
                if(this._isMounted===true){
                this.setState({order:order})
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
                }
                if(this._isMounted===true){
                this.setState({ markerArr: this.state.markerArr.concat(arr)})
                let a =this.state.markerArr
                var uniqe = a.filter(this.onlyUnique)
               
                this.setState({ markerArr: uniqe} )}
                console.log('')
                console.log('init region',order.wayPointList[0].region)
//console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
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
    
    render(){
       
        
        
        
        
        const { loading,modalVisible ,check1,check2,check3,check4,check5} = this.state;
        return(
            <View style={styles.container}>
                
                   
                    
                    
                    <MapView  style={styles.map} 
                        region={order.wayPointList[0].region}
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
                      
                        
                    </MapView>
                    <View style={{flex:1,flexDirection:'row',paddingTop:25}}>
                    
                      <View style={{marginLeft:'70%',justifyContent:'flex-start' }}>
                              <TouchableOpacity style={{backgroundColor:'#E63946',width:100,height:25,alignItems:'center',borderRadius:20}} onPress={()=>this.cancel()}>
                              
                                <Text style={{color:'white'}}>ยกเลิก</Text>
                              </TouchableOpacity>
                              
                      </View>

                    </View>

                    <View style={{marginBottom:'130%' 
                    ,alignItems: 'flex-start',flexDirection:'column'}}>
                              
                             
                              
                                   
                              <View>
                                <Text style={{}}>กำลังค้นหาคนขับ</Text>
                              </View>
                              
                              
                    </View>
                    
                    
                    <View style={styles.centeredView}>
                      
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
            </View>
        )
    }
}
const styles = StyleSheet.create({
    checkBox:{
      backgroundColor:'#A8DADC',
      justifyContent:'center',
      
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
      top: 100,
      left: 0,
      right: 0,
      bottom: 100,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
        backgroundColor:'#F1FAEE'
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
  });

  const mapStateToProps = (state) => (
    
    {user:state.userReducer.user}
  )
const mapDispatchToProps = (dispatch) => {
  return{
  chat: (id) => dispatch(startChat(id)),
  }
}

  export default connect(mapStateToProps,mapDispatchToProps) (Matching)