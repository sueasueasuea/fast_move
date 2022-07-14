import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import auth from '../Firebase/Auth'
import firestore from '../Firebase/Firestore'
import { connect } from 'react-redux';
import {addUser} from '../actions/Users'

class Login extends Component {
  constructor(props){
    super(props);
     this.state = {
       email:null,
       password:null,
       id:null
    };
    
  }
  
  componentDidMount() {
  
  }

  showAlert() {  
      Alert.alert(  
          'Error',  
          'email or password is null',  
          [  
              
              {text: 'OK', onPress: () => console.log('OK Pressed')},  
          ]  
      );  
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

  loginSuccess=(user)=>{
    let id = user.uid
    this.setState({id:user.uid})
    firestore.getUser(id,this.getUserSuccess,this.getUserUnsuccess)
  }

  loginUnsuccess=(error)=>{
    console.log(error)
  }

  onLogin=()=>{
    console.log(this.props.username)
    console.log(this.props.password)
    if(this.state.email != null || this.state.password != null){
        auth.signIn(this.state.email,this.state.password,this.loginSuccess,this.loginUnsuccess)
    }
    else
        this.showAlert()  
  }

  onLogout=()=>{
    
  }
  
    render(props) {
      const { navigation } = this.props;
      return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#F1FAEE' }}>
            
            <Text style={{fontSize:20,color:'black'}}>ลงชื่อเข้าใช้</Text>

          <View style={styles.content}>

            <TextInput 
              placeholder="email" 
              style={styles.textInput} 
              onChangeText={txt=>{this.setState({email:txt})}}/>

            <TextInput 
              secureTextEntry={true}
              placeholder="password" 
              style={styles.textInput} 
              onChangeText={txt=>{this.setState({password:txt})}}/>

            <TouchableOpacity 
              style={styles.buttonLogin} 
              onPress={this.onLogin}>
                <Text style={{fontSize:16, color:'white'}}>เข้าสู่ระบบ</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.buttonLogin} 
              onPress={()=>this.props.navigation.navigate('Register')}>
                <Text style={{fontSize:16, color:'white'}}>สมัครใช้งาน</Text>
            </TouchableOpacity>
            
            <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('Recover')}>
                <Text style={{fontSize:15, color:'#457B9D'}}>ลืมรหัสผ่าน ?</Text>
              </TouchableOpacity>
          </View>

          </View>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    buttonLogin: {
      justifyContent:"center",
      alignItems: "center",
      backgroundColor: "#457B9D",
      marginBottom:8,
      padding:8
    },
    textInput:{
      borderColor: '#457B9D',
      borderWidth: 1,
      paddingStart:20,
      marginBottom:8,
      padding:8,
      fontSize:16,
      color:'#1D3557'
    },
    content:{
      padding:16,
      margin:16,
      width:"90%"
    }
    
  });
  
  
  const mapStateToProps = (state) => (
    {user:state.userReducer.user}
  )
  
  
  const mapDispatchToProps = (dispatch)=>(
    {add:(item)=>dispatch(addUser(item))}
  )
  
  export default connect(mapStateToProps,mapDispatchToProps)(Login)