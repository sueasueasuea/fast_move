import * as React from 'react'
import { Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native'
import Template from './Template'
import { Ionicons } from '@expo/vector-icons';

const FriendUser=(props)=>{
  const headerContent=(
    <View style={styles.container}>
      <TextInput style={{flex:1}} placeholder='Friend User' onChangeText={props.changeText}/>
      <TouchableOpacity onPress={props.onAddPress}>
        <Ionicons name="ios-add-circle" size={40} color="gray" />
      </TouchableOpacity>
    </View>
  )
  return(
    <Template Content={headerContent}/>
  )
}

const styles = StyleSheet.create({
  container:{
    flexDirection:'row',
    alignItems:'center',
    borderColor:'gray',
    borderWidth:1,
    borderRadius:50,
    paddingLeft:10
  }
})

export default FriendUser