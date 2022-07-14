//Splash.js
import React, { Component } from 'react';
import {
  View,FlatList,TouchableOpacity,StyleSheet,Text,Alert,Image,Button,ImageBackground 
} from 'react-native';
import auth from '../Firebase/Auth'
import firestore from '../Firebase/Firestore'
import { connect } from 'react-redux';
import {addRegion, addUser} from '../actions/Users'

class Splash extends Component {
  constructor(props){
    super(props);
     this.state = {
      id:null
    };
    
  }

  getUserSuccess=(data)=>{
    console.log(data)
    let item ={
       email:data.email,
       username:data.username,
       firstname:data.firstname,
       lastname:data.lastname,
       phone:data.phone,
       id:this.state.id
    }
    this.props.add(item)
    this.props.navigation.navigate('MyTabs')
  }

  getUserUnsuccess=(error)=>{
    console.log(error)
  }

  checkSignIn=()=>{
    const user = auth.getCurrentUser()
    console.log('Current : ', user)
    if(user!=null){
     let id = user.uid
     this.setState({id:id})
     firestore.getUser(id,this.getUserSuccess,this.getUserUnsuccess)
    }else{
      
      this.props.navigation.navigate('Login')
      
      this.props.navigation.reset({index:0,routes:[{name:'Login'}]});
    }
  }
  
  componentDidMount() {
    setTimeout(()=>{
      this.checkSignIn()
      
    },2500)    

  }
  
    render(props) {
      const { navigation } = this.props;
      return (
        <View style={{ flex: 1, backgroundColor: '#F1FAEE' }}>
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'black', fontSize: 32 }}>Fast Move</Text>
                <Image 
                    style={{width:'50%',height:'30%',marginTop:'10%'}}
                    source={{uri:'https://cdn-icons-png.flaticon.com/512/679/679821.png'}}>
                </Image>
          </View>
          
        
        </View>
      );
    }
  }
  
  const mapStateToProps = (state) => (
    {user:state.userReducer.user}
  )
  
  
  const mapDispatchToProps = (dispatch)=>(
    {add:(item)=>dispatch(addUser(item)),
    addRegion:(item)=>dispatch(addRegion(item))}
  )
  
  export default connect(mapStateToProps,mapDispatchToProps)(Splash)