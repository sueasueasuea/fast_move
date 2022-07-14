import * as React from 'react'
import { Image, Text, View} from 'react-native'

const Template=(props)=>(
  <View style = {{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-start',
    backgroundColor: '#F8F8F8',
    height: 70,
    padding:5,
    shadowColor:'#000000',
    shadowOffset: {width:0, height:2},
    shadowOpacity: 0.2,
    position:'relative'
  }}>
    <Image style={{
      height:60,
      width:60
    }} source={{uri:'https://www.ar.co.th/asset/images/knowledge/32047944_823.png'}}/>
    <View style = {{flex:1,padding:5}}>
      {props.Content}
    </View>
  </View>
)

export default Template