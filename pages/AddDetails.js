import React,{Component} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Alert,
    TextInput
    
}
from 'react-native';
import { connect } from 'react-redux';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {editMoreOrder,addGnomeOrder} from '../actions/Users';
import axios from "axios";
import Loading from "./Loading";
import auth from "../Firebase/Auth"
import firestore from '../Firebase/Firestore'
import firebase from "../Firebase/Initial";
import 'firebase/firestore';
const initailprice = 36 
var upOnDistPrice = 0
var upOnNumPrice = 0

class AddDetails extends Component{

    constructor(props){
        super(props);
          this.db=firebase.firestore()
          this.state = {
            details:'',
            phonenumber:'',
            price:100,
            date:'',
            month:'',
            years:'',
            hour:'',
            minute:'',
            distance:0,
            duration:0,
            gnome:"",
            loading:false
          };
         
  }
  
        price_cal=(dist,num)=>{
         
          var totalPrice = 0
          if(dist>=1&&dist<=20){
            upOnDistPrice= dist*7
          }else if(dist>20&&dist<=30){
            upOnDistPrice= dist*8
          }else if(dist>30){
            upOnDistPrice= dist*14
          }
          if(num > 2){
            upOnNumPrice = (num-2)*20
          }
          totalPrice = upOnDistPrice+upOnNumPrice+initailprice
          let trantotalPrice=(Math.round(totalPrice * 100) / 100)
          //if use .toFixed(2) u will get string type
          return trantotalPrice
        }
        
        // calculate_for_2_point=()=>{
        //   //const {route}=this.props
        //   let dist = Math.round(route.params.distance/1000)
        //   let dur = Math.round(route.params.duration/60)
        //   let num = 2
        //   let totalPrice = this.price_cal(dist,num)
        //   let minute_dur = dur
        //   this.setState({price:totalPrice})
            
        //   this.setState({duration:minute_dur})
        //   this.setState({distance:dist})
        //   this.setState({gnome:route.params.gnome})
        //   let item ={details:this.state.details,
        //     phone:this.state.phonenumber,price:this.state.price}
        //     this.props.editMoreOrder(item)
        //     console.log('order',this.props.order)
        //     console.log('distance ',this.state.distance,' duration ',this.state.duration,' gnome ',this.state.gnome)
        // }

        calculate=()=>{
          
          axios.get(`https://fast-move-or-something-diff.as.r.appspot.com/get`)  
          .then(res => {  
            let data = res.data; 
            //console.log('data from api that calculated',data) 
            // this.setState({distance:data["distance"]})
            // this.setState({duration:data["duration"]})
            // this.setState({gnome:data["gnome"]})
            
            let dist = (data["distance"]/1000)
            let dur = Math.round(data["duration"]/60)
            let num = data["gnome"].length 
            let totalPrice = this.price_cal(dist,num)
            let minute_dur = dur
            
            
            this.setState({price:totalPrice})
            this.setState({duration:minute_dur})
            this.setState({distance:dist})
            this.setState({gnome:data["gnome"]})
            
          })
          
        }

  saveLastNum=()=>{
    //console.log('saveLastNum',this.state.phonenumber) 
    
    let item ={details:this.state.details,
      phone:this.state.phonenumber,price:this.state.price}
      this.props.editMoreOrder(item)
      // console.log('order',this.props.order)
      // console.log('distance ',this.state.distance,' duration ',this.state.duration,' gnome ',this.state.gnome)
  }

  

  reArrangeSequence=()=>{
    let gnome=this.state.gnome
    //console.log('gnome in reArrange',gnome)
    let wayPointList=[]
    let order = this.props.order
    for (let i=0;i<gnome.length;i++)
    {
      let temp=gnome.charCodeAt(i)-48+1
      wayPointList.push(order.wayPointList.find(obj=>obj.id ==temp))
    }
    return wayPointList
  }

  save =()=>{
    //console.log('order',this.props.order) 
    let user = auth.getCurrentUser() 
    //console.log('user state' ,user)
    let order = this.props.order
    let wayPointList=this.reArrangeSequence()
    let id = user.uid
    let item={
      distance:this.state.distance,
      getTime:order.getTime,
      wayPointList:wayPointList, 
      gnome:this.state.gnome,
      customerID:id,
      price:this.state.price,
      status:"unmatch", 
      detail:this.state.details
    }
    console.log('here is save ')
    console.log('get time is',order.getTime)
    let item2=this.state.gnome
    this.props.addGnomeOrder(item2)
    
    firestore.saveOrder(item,this.saveSuccess,this.saveUnsuccess)
    console.log('order after add gnome ',this.props.order)
  }


  saveSuccess=(id)=>{
    var orderRef = this.db.collection("orders");
    var query = orderRef.where("id","==",id)
    query.get()
    .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              this.props.navigation.navigate('Matching',{orderid:doc.id,fieldid:doc.data().id})
              
          });
            
          
          
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
    
   
  }

  saveUnsuccess=(error)=>{
    console.log(error)
  }

        componentDidMount=()=>{
          
          let temptime = new Date(this.props.order.getTime)
          var date =temptime.getDate()
          var month = temptime.getMonth()+1
          var years = temptime.getFullYear()
          var hour = temptime.getHours()
          var minute =temptime.getMinutes()
          if (hour < 10){
            hour = '0'+hour
          }
          
          if (minute < 10){
            minute = '0'+minute
          } 
          this.setState({date:date})
          this.setState({month:month})
          this.setState({years:years})
          this.setState({hour:hour})
          this.setState({minute:minute})
          
          
          this.calculate()
          
        }
      
        componentDidUpdate(prevProps, prevState) {
          if (prevState.details !== this.state.details||prevState.phonenumber !== this.state.phonenumber) {
            let item ={details:this.state.details,
              phone:this.state.phonenumber,price:this.state.price}
              this.props.editMoreOrder(item)
              // console.log('order',this.props.order)
              // console.log('distance ',this.state.distance,' duration ',this.state.duration,' gnome ',this.state.gnome)
              
          }
        }

        

      render(){
          
        return(
            this.state.loading ? (<Loading></Loading>):
            (
            <View style={styles.container}>
                
                <View style={{paddingLeft:'5%'}}>
                    <Text style={styles.SubHeader}>เวลารับสินค้า</Text>
                    <Text>{this.state.date+'/'+this.state.month+'/'+this.state.years+'  '+this.state.hour+':'+this.state.minute}</Text>
                </View>

               {/*<TouchableOpacity onPress={this.check}> 
                <Text>เช็ค</Text>
                </TouchableOpacity>*/}
                <View style={styles.detailView}>
                <MaterialCommunityIcons name="comment-text-outline" size={24} color="black" />
                  <TextInput style={styles.detailTextInput} placeholder='กรอกรายละเอียดเพิ่มเติม' 
                  onChangeText={txt=>{this.setState({details:txt},()=>{
                    
                    // console.log('detail state in callback',this.state.details)
                  })}}></TextInput>
                </View>
                <View style={styles.detailView}>
                <AntDesign name="phone" size={24} color="black" />
                  <TextInput style={styles.detailTextInput} placeholder='เบอร์ติดต่อของลูกค้า' 
                  onChangeText={txt=>{this.setState({phonenumber:txt},()=>{
                    
                    // console.log('phone state in callback',this.state.phonenumber)
                    this.saveLastNum() 
                  })}}></TextInput>
                </View>
                {/*<View>
                  <Text>ราคา</Text>
                </View>*/}
                
                {/*<TouchableOpacity style={styles.button} onPress={this.onShowPopup}>
                  <Text>เรียก popup</Text>
              </TouchableOpacity>*/}
              <View style={styles.bottomView}>
                <Text style={{alignItems:'flex-end',fontSize:20}}>
                      รายละเอียดค่าบริการ
                </Text>
                <Text >
                  ระยะทาง {this.state.distance} กม.
                </Text>
                <Text  >
                  ราคาเริ่มต้น 36 บาท 
                </Text>
                <Text  >
                  ราคาระยะทาง {Math.round(upOnDistPrice * 100) / 100} บาท
                </Text>
                <Text  >
                  ราคาต่อจำนวนจุด {upOnNumPrice} บาท
                </Text>
                <Text  >
                  ทั้งหมด {this.state.price} บาท
                </Text>
              </View> 
              <TouchableOpacity style={styles.button} onPress={this.save}>
                  <Text style={{color:'white',fontSize:18}}>เรียกงานขนส่ง</Text>
                </TouchableOpacity>
            </View>)
        )
      }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor:'#F1FAEE',
    },
      Header : {
        paddingTop:'10%',
        color: "black",
        fontSize:32,
        
        
      },
      SubHeader :{
          paddingTop:'10%',
          color:'black',
          fontSize:20
      },
      detailTextInput:{
        flex:1,
        backgroundColor:'white',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems:'center',
        width:'100%',
        borderRadius:20,
        borderWidth:1,
        marginLeft:10,
        paddingLeft:10
      },
      detailView:{
        flexDirection:'row',paddingBottom:'5%',
        width:'90%'  ,paddingLeft:'5%',alignItems:'center',paddingTop:'5%'    },
      button:{
        backgroundColor:'#1D3557',
        alignItems:'center',
        justifyContent: 'center',
        margin:100,
        height:50,
        borderRadius:10
        

      },
      bottomView:{
        marginTop:20,
        justifyContent: 'flex-end',
        alignItems:'flex-start',
        paddingLeft:20 ,
        
      },
      
});

const mapStateToProps = (state) => (
    {order:state.orderReducer.order}
  )
  
  const mapDispatchToProps = (dispatch)=>{
    return{
      editMoreOrder:(item)=>dispatch(editMoreOrder(item)),
      addGnomeOrder:(item2)=>dispatch(addGnomeOrder(item2)),
      
    } 
    
  }

  export default connect(mapStateToProps,mapDispatchToProps) (AddDetails)  