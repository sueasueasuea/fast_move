import React from 'react';
import LottieView from 'lottie-react-native';

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  

  render() {
    return (
        <LottieView source={require('../animations/93759-loader-desygner.json')} autoPlay loop />
    );
  }
}

export default Loading