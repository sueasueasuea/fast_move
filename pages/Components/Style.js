import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  imageBackground:{
    flex:1,
    resizeMode:'cover',
    justifyContent:'center'
  },
  middle:{
    backgroundColor:'white',
    borderWidth:1,
    padding:16,
    margin:16,
    borderTopLeftRadius:50,
    borderBottomRightRadius:50
  },
  headerMiddle:{
    flexDirection:'row',
    marginBottom:16
  },
  image:{
    width:120,
    height:120,
    resizeMode:'contain',
    alignSelf:'center',
    marginBottom:8
  },
  headerImage:{
    width:60,
    height:60,
    resizeMode:'contain',
    marginBottom:8
  },
  headerText:{
    fontSize:25,
    alignSelf:'center',
    marginStart:8
  },
  textInput:{
    height:50,
    borderWidth:1,
    borderRadius:25,
    borderColor:'gray',
    paddingStart:20,
    marginBottom:8
  },
  generalButton:{
    backgroundColor:'#DDDDDD',
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:25,
    marginBottom:8
  },
  registerButton:{
    justifyContent:'center',
    alignItems:'flex-end'
  },
  registerText:{
    fontSize:12,
    color:'blue',
    textDecorationLine:'underline',
    marginBottom:16
  },
  frame:{
    backgroundColor:'white',
    flexDirection:'row',
    alignItems:'center',
    borderWidth:1,
    borderColor:'black',
    margin:2,
    padding:8
  },
  avatar:{
    backgroundColor:'red',
    width:60,
    height:60,
    borderRadius:50
  },
  chatContent:{
    flexDirection:'row',
    justifyContent:'flex-end',
    alignContent:'center',
    borderWidth:1,
    borderColor:'black',
    margin:5,
    padding:5,
  },
    txtReceiver: {
    flexWrap: 'wrap',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    padding: 8,
    marginLeft: 4,
    flexShrink: 1,
    borderColor: 'red',
  },
  txtSender: {
    flexWrap: 'wrap',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderWidth: 1,
    padding: 8,
    flexShrink: 1,
    borderColor: 'black',
  },
})

export default styles