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

import auth from '../Firebase/Auth'

export default class Edit extends Component {
  constructor(props){
    super(props);
     this.state = {
      newpassword:null,
      confirmpassword:null,
      oldpassword:null

    };
  }
  changeSuccess=()=>{
    this.props.navigation.navigate('Login')
  }

  changeUnsucess=(error)=>{
    console.log(error)
  }
  
  onChangePress=()=>{
    if(this.state.newpassword===this.state.confirmpassword){
      auth.setNewPassword(this.state.oldpassword,this.state.newpassword,this.changeSuccess,this.changeUnsucess)
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
                placeholder="Old Password"
                secureTextEntry={true}
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({oldpassword:txt})}}/>

              <TextInput 
                placeholder="New Password"
                secureTextEntry={true}
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({newpassword:txt})}}/>

              <TextInput 
                placeholder="Confirm Password"
                secureTextEntry={true} 
                style={styles.textInput} 
                onChangeText={txt=>{this.setState({confirmpassword:txt})}}/>
            
              <TouchableOpacity 
                style={styles.buttonLogin} 
                onPress={this.onChangePress}>
                  <Text style={{fontSize:16, color:'white'}}>Change Password</Text>
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
  container: {
    flex: 1
  },
  
});