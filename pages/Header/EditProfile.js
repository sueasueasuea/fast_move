import * as React from 'react'
import { Text } from 'react-native'
import Template from './Template'

const Edit=()=>{
  const headerContent = <Text style={{fontSize:25}}>Edit Account</Text>
  return (
    <Template Content={headerContent}/>
  )
}

export default Edit