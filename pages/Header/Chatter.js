import * as React from 'react';
import { Text } from 'react-native';
import Template from './Template';

const Chatter = () => {
  const headerContent = <Text style={{fontSize:25}}>Chat</Text>
  return (
    <Template Content={headerContent}/>
  )
}

export default Chatter;