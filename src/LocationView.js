import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Animated, Platform, UIManager, 
  TouchableOpacity, Text, ViewPropTypes } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import axios from 'axios';
import Events from 'react-native-simple-events';
import MapView from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AutoCompleteInput from './AutoCompleteInput';
import { connect } from 'react-redux';
import {editRegion} from '../actions/Users'
import { TextInput } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

const PLACE_DETAIL_URL = 'https://maps.googleapis.com/maps/api/place/details/json';
const DEFAULT_DELTA = { latitudeDelta: 0.015, longitudeDelta: 0.0121 };
const apiKey="AIzaSyCfjk1u2VcAvNfK31VMN581MMNePvR2J-k";
const initialLocation={
            latitude: 13.120938398049654,
            longitude: 100.91920675927467,
          };
// KU SRC Location
const actionText 
            ='add';
const markerColor='red';
const debounceDuration =300;
const components=[];
const timeout=15000;

const maximumAge= 'Infinity';
const enableHighAccuracy= true;
class LocationView extends Component {

  constructor(props) {
    super(props);
    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    
    
  }

  componentDidMount() {
    Events.listen('InputBlur', this.constructor.displayName, this._onTextBlur);
    Events.listen('InputFocus', this.constructor.displayName, this._onTextFocus);
    Events.listen('PlaceSelected', this.constructor.displayName, this._onPlaceSelected);
  }

  componentWillUnmount() {
    Events.rm('InputBlur', this.constructor.displayName);
    Events.rm('InputFocus', this.constructor.displayName);
    Events.rm('PlaceSelected', this.constructor.displayName);
  }

  state = {
    inputScale: new Animated.Value(1),
    inFocus: false,
    region: {
      ...DEFAULT_DELTA,
      ...initialLocation,
    },
    phonenumber:'',
    details:''
  };
  
  onLocationSelect=()=>{
    
    
    const {route} =this.props
    //let i = route.getParent("index")
    //console.log("route",route.params.index)
   // console.log('ph',this.state.phonenumber)
    //console.log('deta',this.state.details)

    let item ={ region:this.state.region,
                address:this._input.getAddress(),
                index:route.params.index,
                phonenumber:this.state.phonenumber,
                details:this.state.details
    } 
    this.props.editRegion(item)
    this.props.navigation.navigate('MyTabs')
  }

  _animateInput = () => {
    Animated.timing(this.state.inputScale, {
      toValue: this.state.inFocus ? 1.2 : 1,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  _onMapRegionChange = region => {
    this._setRegion(region, false);
    if (this.state.inFocus) {
      this._input.blur();
    }
  };

  _onMapRegionChangeComplete = region => {
    this._input.fetchAddressForLocation(region);
  };

  _onTextFocus = () => {
    this.state.inFocus = true;
    this._animateInput();
  };

  _onTextBlur = () => {
    this.state.inFocus = false;
    this._animateInput();
  };

  _setRegion = (region, animate = true) => {
    this.state.region = { ...this.state.region, ...region };
    //console.log(this.state.region)
    
    if (animate) this._map.animateToRegion(this.state.region);
  };

  _onPlaceSelected = placeId => {
    this._input.blur();
    axios.get(`${PLACE_DETAIL_URL}?key=${apiKey}&placeid=${placeId}`).then(({ data }) => {
      let region = (({ lat, lng }) => ({ latitude: lat, longitude: lng }))(data.result.geometry.location);
      this._setRegion(region);
      this.setState({placeDetails: data.result});
    });
  };

  _getCurrentLocation = () => {
    //const { timeout, maximumAge, enableHighAccuracy } = this.props;
    let options = {
    timeout: 5000,
    enableHighAccuracy: false,maximumAge: 1000
    }
    Geolocation.getCurrentPosition(
    position => {
    const { latitude, longitude } = position.coords;
    this._setRegion({latitude, longitude});
    },
    error => console.log(error.message),
    options
    );
    };

  render() {
    const {route} =this.props
    let { inputScale } = this.state;
    var textdetail =""
    if(route.params.index===0){
      textdetail="ไปรับของอะไรบ้าง"
    }else{
      textdetail="ไปส่งของอะไรบ้าง"
    }
    return (
      <View style={styles.container}>
        <MapView
          ref={mapView => (this._map = mapView)}
          style={styles.mapView}
          region={this.state.region}
          showsMyLocationButton={true}
          showsUserLocation={false}
          onPress={({ nativeEvent }) => this._setRegion(nativeEvent.coordinate)}
          onRegionChange={this._onMapRegionChange}
          onRegionChangeComplete={this._onMapRegionChangeComplete}
        />
        
        <View style={styles.fullWidthContainer}>
          <AutoCompleteInput
            ref={input => (this._input = input)}
            apiKey={apiKey}
            style={[styles.input, { transform: [{ scale: inputScale }] }]}
            debounceDuration={debounceDuration}
            components={components}
          />

        </View>
        <Entypo
          name={'location-pin'}
          size={30}
          color={markerColor}
          style={{flex:1,alignItems:'center',justifyContent:'center', backgroundColor: 'transparent' }}
        />

        {/* <TouchableOpacity
          style={[styles.currentLocBtn, { backgroundColor: markerColor }]}
          onPress={this._getCurrentLocation}
        >
          <MaterialIcons name={'my-location'} color={'white'} size={25} />
        </TouchableOpacity> */}
        <View style={styles.detailView}>
          <Text style={styles.headers}>ระบุข้อมูลจุดรับ-ส่ง </Text>
          <View style={{flexDirection:'row',paddingBottom:'5%',}}>
            <Feather name="phone-call" size={22} color="black" alignItems='center'  />
            <TextInput style={styles.detailTextInput} placeholder=' เบอร์ติดต่อ' 
            onChangeText={txt=>{this.setState({phonenumber:txt})}}></TextInput>
          </View>
          <View style={{flexDirection:'row',paddingBottom:'5%'}}>
            <Ionicons name="document-text-outline" size={24} color="black" />
            <TextInput style={styles.detailTextInput} placeholder= {textdetail}
            onChangeText={txt=>{this.setState({details:txt})}}></TextInput>
          </View>
          

          <TouchableOpacity
            style={[styles.actionButton]}
            onPress={() =>{ this.onLocationSelect({...this.state.region, address: this._input.getAddress(), placeDetails: this.state.placeDetails})
            }}
            
          >
            <View>
              
              <Text style={[styles.actionText]}>{actionText}</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {this.props.children}
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor:'red',
    flexDirection:'column'
  },
  mapView: {
    ...StyleSheet.absoluteFillObject,
  },
  fullWidthContainer: {
    flex:1.70,
    width: '100%',
    
    alignItems: 'center',
    //backgroundColor:'green'
  },
  input: {
    width: '95%',
    padding: '10%',
  },
  currentLocBtn: {
    backgroundColor: '#000',
    padding: 5,
    borderRadius: 5,
    position: 'absolute',
    bottom: 70,
    right: 10,
  },
  actionButton: {
    backgroundColor: '#000',
    width:'50%',
    height:'20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom:'5%'
  },
  actionText: {
    color: 'white',
    fontSize: 23,
  },
  detailView:{
    flex:1,
    backgroundColor:'white',
    flexDirection:'column',
    justifyContent: 'center',
    alignItems:'center',
    width:'100%',
    
  },
  headers:{
  
  padding:'2%',
  fontSize:23
  },
  detailTextInput:{
    borderWidth: 1,
    width:'70%',
    paddingLeft:10,
    borderRadius:15,
    marginLeft:10
  }
});

const mapDispatchToProps = (dispatch)=>(
  {editRegion:(item)=>dispatch(editRegion(item))}
)

const mapStateToProps = state => ({});

export default  connect (mapStateToProps,mapDispatchToProps)  (LocationView)