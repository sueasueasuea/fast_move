import * as React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  FlatList,
  Image,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './Components/Style';
import Header from './Header/Chatter';
import { connect } from 'react-redux';
import firestore from '../Firebase/Firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      messages: [],
    };
    firestore.listeningMessage(this.props.chat, this.listeningPass);
  }

  listeningPass = (data) => {
    this.setState({ messages: this.state.messages.concat(data) });
  };

  sendPass = (docRef) => {};

  sendFail = (error) => {
    console.log(error);
  };

  onSend = () => {
    if (this.state.message) {
        firestore.sendMessage(this.props.chat, this.props.id, this.state.message, this.sendPass, this.sendFail);
      this.setState({message:''})
    }
    else {
      console.log('Enter the message.');
    }
  };

  renderItem = ({ item }) => {
    return (
      <View>
        {item.sender === this.props.id && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Text style={styles.txtSender}>{item.message}</Text>
          </View>
        )}
        {item.sender !== this.props.id && (
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            <Text style={styles.txtReceiver}>{item.message}</Text>
          </View>
        )}
      </View>
    );
  };

  renderSeparator = () => <View style={{ height: 5, width: '100%' }} />;

  render(props) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>
        <Header />
        <FlatList
          data={this.state.messages}
          renderItem={this.renderItem}
          keyExtractor={(item) => item.date}
          ItemSeparatorComponent={this.renderSeparator}
          ref={(ref) => {
            this.flatListRef = ref;
          }}
          onContentSizeChange={() => this.flatListRef.scrollToEnd()}
        />
        <View style={{ flex: 1 }}></View>
        <View style={styles.chatContent}>
          <TextInput
            style={{ flex: 1, paddingLeft: 10 }}
            value={this.state.message}
            placeholder="Message"
            onChangeText={(text) => this.setState({ message: text })}
          />
          <TouchableOpacity onPress={() => this.onSend()}>
            <MaterialCommunityIcons name="send-circle" size={40} color="grey" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapStoreToProps = (store) => ({
  id: store.userReducer.user.id,
  chat: store.userReducer.chatid,
});

export default connect(mapStoreToProps)(Chat);
