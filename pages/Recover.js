import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,

} from 'react-native';

import auth from '../Firebase/Auth'



class Recover extends Component {
  constructor(props){
    super(props);
     this.state = {
       email:null,
    };
  }
  
  componentDidMount() {

  }

  unsuccess=(error)=>{
    console.log(error)
  }

  success=()=>{
    console.log('Email was sent')
  }


  onRecover=()=>{
    auth.sendPassword(this.state.email,this.success,this.unsuccess)
  }

  render(props) {
    const { navigation } = this.props;
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#F1FAEE' }}>

          <View style={styles.content}>

            <TextInput 
              placeholder="Email" 
              style={styles.textInput} 
              onChangeText={txt=>{this.setState({email:txt})}}/>

            <TouchableOpacity 
              style={styles.buttonLogin} 
              onPress={this.onRecover}>
                <Text style={{fontSize:16, color:'white'}}>Send</Text>
            </TouchableOpacity>

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
    width:"90%",
    backgroundColor:'#F1FAEE'
  }
  
});


export default Recover;