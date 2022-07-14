import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  StatusBar,
  Alert,
  FlatList,
  RefreshControl
} from 'react-native';
import { Card,Avatar,Title,Paragraph } from 'react-native-paper';
import { connect } from 'react-redux';
import auth from "../Firebase/Auth"
import 'firebase/firestore';
import firebase from 'firebase';
import {startChat} from '../actions/Users'
class CurrentJob extends Component {
  constructor(props){
    super(props);
    this.db = firebase.firestore();
     this.state = {
       orders:null,
       refreshing:false
    };
  }
  onRefresh =  () => {
    this.setState({refreshing:true})
    let user = auth.getCurrentUser() 
    let customerID = user.uid
    firebase.firestore().collection("orders").where("status","==","matched").where("customerID", "==",customerID).get().then((querySnapshot) => {
        
        let orders = [];
        console.log('before foreach')
        querySnapshot.forEach((doc) => {
            console.log('id doc',doc.id)
            orders.push(doc.data())
            //console.log(doc.data()) 
            
            
        })  
        this.setState({orders:orders})
        
        // Promise.all(this.state.promises).then(function(data){
        //   that.setState({orders:orders})
        //   console.log("orders list",that.state.orders)
        // })   
        
    })  
          
       
       // Promise.all(this.state.promises).then(function(data){
       //   that.setState({orders:orders})
       //   console.log("orders list",that.state.orders)
       // })   
    
     this.setState({refreshing:false},()=>
     console.log('orders in list state',this.state.orders))
     
   }
   renderSeperator=()=>{
    return(
      <View style={{height:1,backgroundColor:'#dddddd'}}>
      </View>
    );
  }
  renderHeader=()=>{
    return(
      <View style={{alignItems:'center'}}>
          
          <Text style={{color:'gray'}} >pull to refresh</Text></View>
    
    );
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
  componentWillUnmount=()=>{
    this.ordersListener();
  }
  componentDidMount=() =>{
    let user = auth.getCurrentUser() 
    let customerID = user.uid
    this.ordersListener=this.db.collection("orders").where("status","==","matched")
        .onSnapshot((querySnapshot) => {
          let orders=[];
        querySnapshot.forEach((doc) => {
            
            console.log('tumrai')
            if(doc.data().customerID==customerID)
            {
                orders.push(doc.data())
                
              
            }
            
        });
        this.setState({orders:orders})  
        
    });
    // firebase.firestore().collection("orders").where("status","==","matched").where("customerID", "==",driverid).get().then((querySnapshot) => {
        
    //     let orders = [];
    //     console.log('before foreach')
    //     querySnapshot.forEach((doc) => {
    //         console.log('id doc',doc.id)
    //         orders.push(doc.data())
    //         //console.log(doc.data()) 
    //         this.setState({orders:orders})
            
    //     })  
           
        
    //     // Promise.all(this.state.promises).then(function(data){
    //     //   that.setState({orders:orders})
    //     //   console.log("orders list",that.state.orders)
    //     // })   
        
    // })
  }

  onPressDetail=(item)=>{
    
    this.props.chat(item.chat)
    console.log(item.chat,'item.chat')
    console.log('item' , item)
    console.log('')
    var docRef=this.db.collection("orders").where("id","==",item.id);
    docRef.get()
    .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              // doc.data() is never undefined for query doc snapshots
              //console.log(doc.id, " => ", doc.data());
              console.log(doc.id)
               this.props.navigation.navigate('Matched',{order:doc.data(),orderid:doc.id,fieldid:item.id,driverid:item.driverID})
              //this.props.navigation.navigate('Full')
          });
            
          
          
    })
    .catch((error) => {
        console.log("Current jon Error getting documents: ", error);
    });
    
    
  }
  

  render(props) {
    const { navigation } = this.props;
    //let arr=[]
    // for(let i=0;i<num;i++)
    //     {
    //         arr.push(
    //             <Paragraph>{`จุดที่ ${i+1} `+item.wayPointList[i].address}</Paragraph>,
    //             <Paragraph>{`รายละเอียดงาน : `+item.wayPointList[i].details}</Paragraph>,
    //             //<Paragraph>{`เบอร์ติดต่อ : `+item.wayPointList[i].phonenumber}</Paragraph>
    //         )
    //     }
    //console.log(route.params.item,route.params.num)
    return (
        <View style={{paddingTop:StatusBar.currentHeight,flex:1}}>
                    
                    <FlatList
                        data={this.state.orders}
                        renderItem={({ item }) =>{
                        let num =item.gnome.length
                        console.log('item wayPoint',item)
                        let arr=[]
                        for(let i=0;i<num;i++)
                        {
                            arr.push(
                                <Paragraph>{`จุดที่ ${i+1} `+item.wayPointList[i].address}</Paragraph>
                            )
                        }
                        return(
                            <View style={{padding:8}}>
                              <Card 
                              >
                                <Card.Title title={item.distance+" Km     "+this.renderTime(item.getTime)} 
                                />
                                <Card.Content>
                                  <Title>ลำดับจุดส่ง</Title>
                                  {arr}
                                  <Paragraph>{"ราคา : "+item.price} </Paragraph>
                                  
                                </Card.Content>
                                <Card.Actions style={{justifyContent:'space-between'}}>
                                  
                                  <TouchableOpacity style={styles.button} onPress={()=>this.onPressDetail(item)}   ><Text style={{color:'black'}}>รายละเอียด</Text>
                                  </TouchableOpacity>
                                </Card.Actions>
                                
                              </Card>
                    
                            </View>
                        
                        )
      
              
                      }}
                        ItemSeparatorComponent={this.renderSeperator}
                        ListHeaderComponent={this.renderHeader}
                        refreshControl={
                          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                        }

                        keyExtractor={(item)=>item.id}
                        
                        ref={(ref)=>{this.myRef=ref}}
                    />
                    
                </View>
    );
  }
}

const styles = StyleSheet.create({
  button:{
    width:100,
    height:30,
    borderRadius:20,
    backgroundColor:'#A8DADC',
    justifyContent:'center',
    alignItems:'center'
    
  }
});

const mapStateToProps = (state) => (
    
  {}
)
const mapDispatchToProps = (dispatch) => {
return{
chat: (id) => dispatch(startChat(id)),
}
}

export default connect(mapStateToProps,mapDispatchToProps) (CurrentJob)