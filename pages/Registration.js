import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import auth from '../Firebase/Auth'
import firestore from '../Firebase/Firestore'

class Registraion extends Component {
  constructor(props){
    super(props);
     this.state = {
       email:null,
       password:null,
       confirmpassword:null,
       username:null,
       firstname:null,
       lastname:null,
       phone:null
    };
  }
  
  componentDidMount() {
 
  }

  registerUnsuccess=(error)=>{
    console.log(error)
  }

  registerSuccess=(user)=>{
    let item ={
      username:this.state.username,
      firstname:this.state.firstname,
      lastname:this.state.lastname,
      phone:this.state.phone,
      email:this.state.email,
      time:null,
      role:null,
      profileimage:null,
      status:null,
      carid:null

    }
    console.log(item)
    firestore.addUser(user.uid,item,this.addSuccess,this.addUncsuccess)
  }

  addSuccess=()=>{
    this.props.navigation.navigate('Login')
  }

  addUncsuccess=(error)=>{
    console.log(error)
  }


  

  onRegister=()=>{
    if(this.state.password!=null){
       if(this.state.password===this.state.confirmpassword){
        auth.createAccount(this.state.email,this.state.password,this.registerSuccess,this.registerUnsuccess)
       }
    }
  }




  render(props) {
    const { navigation } = this.props;
    return (
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.content}>

              <TextInput 
                placeholder="User Name" 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({username:txt})}}/>

              <TextInput 
                placeholder="Fisrt Name" 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({firstname:txt})}}/>
              <TextInput 
                placeholder="Last Name" 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({lastname:txt})}}/>

              <TextInput 
                placeholder="Phone " 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({phone:txt})}}/>

              <TextInput 
                placeholder="Email" 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({email:txt})}}/>
              <TextInput 
                placeholder="Password"
                secureTextEntry={true}
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({password:txt})}}/>
              <TextInput 
                placeholder="Confirm Password"
                secureTextEntry={true} 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({confirmpassword:txt})}}/>
            
              <TouchableOpacity 
                style={styles.buttonLogin} 
                onPress={this.onRegister}>
                  <Text style={{fontSize:16, color:'white'}}>Register</Text>
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
  date:{
    borderWidth:1,
    borderColor: '#457B9D',
    padding:8,
    paddingStart:20,
     marginBottom:8,
    flexDirection:'row', 
    alignItems:'stretch', 
  },
  text:{
  
    padding:8,
    fontSize:16,
    
  },
  content:{
    padding:16,
    margin:16,
    width:"90%"
    ,backgroundColor:'#F1FAEE'
  },
  container: {
    flex: 1,
    backgroundColor:'#F1FAEE'

  },
  
});


export default Registraion;