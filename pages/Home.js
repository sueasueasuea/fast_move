import { Component} from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
}
from 'react-native';
import { TextInput } from "react-native-gesture-handler";
import * as React from 'react';
import {AntDesign} from "@expo/vector-icons";
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { addRegion,deleteRegion, saveOrder } from "../actions/Users";
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import Loading from './Loading';
import * as RootNavigation from '../src/RootNavigation.js';
//import {apiKey,appEngineUrl} from 'react-native-dotenv'
const options = [
  { value: 'instanly', label: 'รับสินค้าทันที' },
  { value: 'picktime', label: 'รับสินค้าล่วงหน้า' }
  
];
const apiKey="AIzaSyCfjk1u2VcAvNfK31VMN581MMNePvR2J-k"
const Distance_URL="https://maps.googleapis.com/maps/api/distancematrix/json"
const appEngineUrl="https://fast-move-or-something-diff.as.r.appspot.com"

class Home extends Component {
  constructor(props){
    super(props);
    this.state = {
      email:null,
      username:null,
      firstname:null,
      lastname:null,
      id:null,
      waypointnum:0,
      waypointlist:['Select location'],
      value: null,
      isFocus:false,
      date:new Date(),
      time:null,
      mode:null,
      show:false,
      showBtn:false,
      distance:0,
      duration:0,
      loading:false,
      promises:[],
      gnome:"",
     
      
    };
    this.myRef = React.createRef();
      
  }

  showAlert() {  
    Alert.alert(  
      'Error',  
        '10 waypoint is max',  
        [  
              
              {text: 'OK', onPress: () => console.log('OK Pressed')},  
        ]  
    );  
  }  
  showAlertNoAddWayPoint() {  
    Alert.alert(  
        'Error',  
        'waypoint is none,pls add waypoint and pick location',  
        [  
            
            {text: 'OK', onPress: () => console.log('OK Pressed')},  
        ]  
    );  
  }  
  showAlertNoneOfWayPoint() {  
    Alert.alert(  
        'Error',  
        'waypoint is none,pls pick location',  
        [  
            
            {text: 'OK', onPress: () => console.log('OK Pressed')},  
        ]  
    );  
  }  
  showAlertNoneOfSendPoint() {  
    Alert.alert(  
      'Error',  
      'send point is none,pls pick send point',  
      [  
          
          {text: 'OK', onPress: () => console.log('OK Pressed')},  
      ]  
    );  
  }  

  showAlert2() {  
    Alert.alert(  
        'Error',  
        'You choose instanly no need to pick a time',  
        [  
              
            {text: 'OK', onPress: () => console.log('OK Pressed')},  
        ]  
    );  
  }  
  
  // componentWillUnmount=()=>{
  //   this.setState({arr:[]})
  // }
  showAlert3() {  
    Alert.alert(  
        'Error',  
        'You have to choose time to get item',  
        [  
            
            {text: 'OK', onPress: () => console.log('OK Pressed')},  
        ]  
    );  
  }  
  showAlert4() {  
    Alert.alert(  
        'Error',  
        'Please Select time',  
        [  
            
            {text: 'OK', onPress: () => console.log('OK Pressed')},  
        ]  
    );  
  }  
  AlertLocation() {  
    Alert.alert(  
        'Error',  
        'Locations have somthing wrong',  
        [  
            
            {text: 'OK', onPress: () => console.log('OK Pressed')},  
        ]  
    );  
  }  

  goToPickLocationPage=(i)=>{

    this.props.navigation.navigate('LocationView',{index:i})
  }

  removeInput =(i)=>{
    let item ={index:i}
    this.props.deleteRegion(item)
    //console.log(this.props.pointList)
    this.setState({waypointnum:this.state.waypointnum-1})
  }

  addInput =()=>{
    if(this.state.waypointnum<10){
      this.setState({waypointlist : this.state.waypointlist.concat(["Select location"])});

      let item ={
        id:0,
        region:{},
        address:'',
        phonenumber:'',
        details:''
        }

      this.props.addRegion(item)
      this.setState({waypointnum:this.state.waypointnum+1})

    }else{

        this.showAlert()
    }
    //console.log('in point',this.props.pointList)
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption }, () =>
  console.log(`Option selected:`, this.state.selectedOption));
    if(selectedOption==='instanly'){
      this.setState({showBtn:false})
    }else{
      this.setState({showBtn:true})
    }
  }

  popupDatePicker = () =>{
    //console.log('popupDate')
    if(this.state.value==='instanly'){
      this.showAlert2()
    }
    if(this.state.value==='picktime'){
      //console.log('เข้าเลือกวันที่นะ')
      this.showDatepicker()
    }if(this.state.value===null){
      //console.log('null kb')
      this.showAlert3()
    }
  }

  popupTimePicker = () =>{
      
    //console.log('popupTime')
    if(this.state.value==='instanly'){
      this.showAlert2() 
    }
    if(this.state.value==='picktime'){
      //console.log('เข้าเลือกเวลานะ')
      this.showTimepicker()
    }if(this.state.value===null){
      //console.log('null kb')
      this.showAlert3()
    }
  }

  showDatepicker = () => {
    this.showMode('date')
  }
  
  showTimepicker = () => {
    this.showMode('time');
  }

  showMode = (currentMode) => {
    this.setState({show:true})
    this.setState({mode:currentMode})
  }
    

  onChange = (event,selectedDate) => {
    const currentDate = selectedDate || this.state.date;
      
    this.setState({show:Platform.OS === 'ios'})

    this.setState({date:currentDate});
     
    //console.log('changed date',this.state.date)
  }
   
  goToAddDetails=()=>{
    let time=null
    if(this.state.value==='instanly'){
      time = new Date();
      this.goToAddDetails2(time)
    }
    if(this.state.value==='picktime'){
      time = this.state.date
      this.goToAddDetails2(time)
    }if(this.state.value===null){
      this.showAlert4()
    }
      //let list = JSON.parse(JSON.stringify(this.props.pointList));
      //console.log('waypointlist',this.state.waypointlist) 
  }

  goToAddDetails2=(time)=>{
    let list = this.props.pointList
    let item ={
      getTime:time,
      wayPointList:list
    }
    this.props.saveOrder(item)
    //console.log('this.props.order',this.props.order)
    this.calculatewaypoint()
    this.setState({promises:[]})
    //this.props.navigation.navigate('AddDetails')
    
  }

  calculatewaypoint=()=>{
    var num = this.state.waypointnum
    let orilat=""
    let orilng=""
    let deslat=""
    let deslng=""
    var Disarr = []
    var Timearr = []
    var temp_dist=[]
    var temp_dur=[]
    let check =this.props.pointList[0].region.latitude
    console.log('check value',check)
    
    switch(num){
      case 0:
        this.showAlertNoAddWayPoint()
        break;
      case 1:
        this.showAlertNoneOfSendPoint()
        break;
      case 2:
        console.log('case 2')
        if(check==null){
          this.showAlertNoneOfWayPoint()
          break;
        }
        //console.log('case 2 ')
        orilat=JSON.parse(JSON.stringify(this.props.pointList[0].region.latitude)) 
        orilng=JSON.parse(JSON.stringify(this.props.pointList[0].region.longitude)) 
        deslat=JSON.parse(JSON.stringify(this.props.pointList[1].region.latitude))
        deslng=JSON.parse(JSON.stringify(this.props.pointList[1].region.longitude)) 

        let config = {
          method: 'get',
          url: `${Distance_URL}?origins=${orilat}%2C${orilng}&destinations=${deslat}%2C${deslng}&key=${apiKey}`,
          headers:{}
        };

        this.setState({promises:this.state.promises.push((axios(config)
        .then( (response) => {
          let data =JSON.parse(JSON.stringify( response.data))
          //console.log(data);
          
          this.setState({distance:data.rows[0].elements[0].distance.value})
          this.setState({time:data.rows[0].elements[0].duration.value})
          this.setState({gnome:"01"})
          // console.log('dis',this.state.distance)
          // console.log('time',this.state.time)
          temp_dist[0]=data.rows[0].elements[0].distance.value
          temp_dur[0]=data.rows[0].elements[0].duration.value
        })
        .catch(function (error) {
          console.log(error);
          
        })))})
        this.waitresponse2point(temp_dist,temp_dur)
        break;
      default:
        if(check==null){
          this.showAlertNoneOfWayPoint()
          break;
        }
        //console.log('default case ') 
        for(let k = 0; k<num; k++)
        {
          let temp =[]
          let temp2=[]
          for(let l = 0; l<num;l++)
          {
            temp.push(0)
            temp2.push(0)
          }
          Disarr.push(temp)
          Timearr.push(temp2)
        }
        // console.log(Disarr)
        // console.log(Timearr)
        // console.log('default')
        for(let i = 0 ; i<num; i++)
        {
            
          for(let j = 0; j<num; j++ )
          {
              
            orilat=JSON.parse(JSON.stringify(this.props.pointList[i].region.latitude)) 
            orilng=JSON.parse(JSON.stringify(this.props.pointList[i].region.longitude)) 
            deslat=JSON.parse(JSON.stringify(this.props.pointList[j].region.latitude))
            deslng=JSON.parse(JSON.stringify(this.props.pointList[j].region.longitude)) 

            let config = {
              method: 'get',
              url: `${Distance_URL}?origins=${orilat}%2C${orilng}&destinations=${deslat}%2C${deslng}&key=${apiKey}`,
              headers:{}
            };

            this.setState({promises:this.state.promises.push((axios(config)
            .then((response)=> {
                      
              let data_temp = (JSON.parse(JSON.stringify(response.data)))
              //console.log(data_temp);
                    
              Disarr[i][j]=data_temp.rows[0].elements[0].distance.value
              Timearr[i][j]=data_temp.rows[0].elements[0].duration.value
                 
            }).catch(function (error) {
              console.log(error);
              
            })))})
          }      
        }
        
        this.waitresponse(Disarr,Timearr,num) 
        
    }
  }
  
  waitresponse2point=(temp_dist,temp_dur)=>{
    this.setState({loading:true})
    const start = performance.now()
    Promise.all(this.state.promises)
    
    .then(function (data){
      const duration = performance.now()-start
      console.log('executed time is ',duration,' ms')
      // console.log(data);
      // console.log('print temp_dist',temp_dist[0])
      // console.log('print temp_dur',temp_dur[0])
      var sendParaToAPI2 = {
        method: 'post',
        url: `${appEngineUrl}/send2point`,

        data: {
          
          distance: temp_dist[0],
          duration : temp_dur[0]
        }
      };
      axios(sendParaToAPI2)
      .then(function (response) {
       
        let data =response
        //console.log('status of sending 2 point api',data);
        RootNavigation.navigate('AddDetails');
      }).catch(function (error) {
        console.log(error);
      });
    })
    this.setState({loading:false})
  }
     
      
    
  

  waitresponse=(Disarr,Timearr,num)=>{
    this.setState({loading:true})
    const start = performance.now()
    //console.log(this.state.promises)
    Promise.all(this.state.promises)
    .then(function (data) {
      const duration = performance.now()-start
      console.log('executed time is ',duration,' ms')
      // Log the data to the console
      // You would do something with both sets of data here
      // console.log(data);
      // console.log('print disarr',Disarr)
      // console.log('print timearr',Timearr)
      
      var sendParaToAPI = {
        method: 'post',
        url: `${appEngineUrl}/send`,
 
        data: {
          num : num,
          distanceArray: Disarr,
          timeArray: Timearr
        }
      };
      
      axios(sendParaToAPI)
      .then(function (response) {
        
        let data =response
        //console.log('status of sending api',data);
        RootNavigation.navigate('AddDetails');
        }).catch(function (error) {
          console.log(error);
        });
      }).catch(function (error) {
        // if there's an error, log it
        console.log(error);
      })
      this.setState({loading:false})
    
  }
    render() {
        

        let arr=[]
        for (let i=0;i<this.state.waypointnum;i++){
            if(i===0){

              arr.push(
                
                <View key={i} style={{flexDirection:'row',alignItems:'center',padding:'2%'}}>
                  <Text style={{paddingRight:5}}>{i+1}.</Text>
                  <TextInput editable={false} selectTextOnFocus={false} style={{paddingLeft:10,backgroundColor:'white',borderColor:'black',borderWidth:1,width:'75%',borderRadius:20,color:'#1D3557'}} placeholder='เลือกจุดรับของ'
                  value={this.props.pointList[i] ? this.props.pointList[i].address : "เลือกจุดรับของ"}>
                  
                  </TextInput>
                  <View style={{paddingLeft:5,flexDirection:'row',alignItems:'center'}}>
                      <TouchableOpacity onPress={()=>this.goToPickLocationPage(i)}
                        styles={styles.buttonLogin}>
                        <MaterialIcons name="gps-fixed" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>this.removeInput(i)}
                        styles={styles.buttonLogin}>
                        <AntDesign name="minuscircleo" size={20} color="red"></AntDesign>
                      </TouchableOpacity>
                  </View>
                </View>
              )
            }else{
              arr.push(
                <View key={i} style={{flexDirection:'row',alignItems:'center',padding:'2%'}}>
                  <Text style={{paddingRight:5}}>{i+1}.</Text>
                  <TextInput editable={false} selectTextOnFocus={false} style={{paddingLeft:10,backgroundColor:'white',borderColor:'black',borderWidth:1,width:'75%',borderRadius:20,color:'#1D3557'}} placeholder='เลือกจุดส่งของ'
                  value={this.props.pointList[i] ? this.props.pointList[i].address : "เลือกจุดส่งของ"}>
                  
                  </TextInput>
                  <View style={{paddingLeft:5,flexDirection:'row',alignItems:'center'}}>
                      <TouchableOpacity onPress={()=>this.goToPickLocationPage(i)}
                        styles={styles.buttonLogin}>
                        <MaterialIcons name="gps-fixed" size={24} color="black" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>this.removeInput(i)}
                        styles={styles.buttonLogin}>
                        <AntDesign name="minuscircleo" size={20} color="red"></AntDesign>
                      </TouchableOpacity>
                  </View>
                  
                </View>
              )
            }
            
          }
                   
        return (
            
              this.state.loading ? (<Loading></Loading>) : (
                
              <ScrollView contentContainerStyle={styles.container}>
                
                
                {arr}
                
                <TouchableOpacity onPress={this.addInput}
                      
                    >
                      <Text style={{color:'black',fontWeight:'bold'}}>+ Add New Waypoint</Text>
                </TouchableOpacity>
               
                <Dropdown
                  style={[styles.dropdown, this.state.isFocus && { borderColor: 'blue' }]}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  inputSearchStyle={styles.inputSearchStyle}
                  iconStyle={styles.iconStyle}
                  data={options}
                  //search
                  dropdownPosition='down'
                  maxHeight={120}

                  labelField="label"
                  valueField="value"
                  placeholder={!this.state.isFocus ? 'เลือกเวลา' : '...'}
                  searchPlaceholder="Search..."
                  value={this.state.value}
                  onFocus={() => this.setState({isFocus:true})}
                  onBlur={() =>this.setState({isFocus:false})}
                  onChange={item => {
                    this.setState({value:item.value});
                    this.setState({isFocus:false});
                    this.handleChange(item.value)
                    //console.log(this.state.value)
                  }}
                   renderLeftIcon={() => (
                      <MaterialCommunityIcons
                        style={styles.icon}
                        color={this.state.isFocus ? 'blue' : 'black'}
                        name="timetable"
                        size={20}
                      />
                      )}
                />
               <View style={{flexDirection:'row',height:'10%',paddingVertical:'5%',}}>
               {this.state.showBtn&&( <TouchableOpacity style={styles.pickDateTimeButton}  onPress={this.popupDatePicker}>
                    <Text style={{color:'white'}}>เลือกวัน</Text>
                    </TouchableOpacity>)}
               {this.state.showBtn&&( <TouchableOpacity style={styles.pickDateTimeButton} onPress={this.popupTimePicker}>
                    <Text style={{color:'white'}}>เลือกเวลา</Text>
                    </TouchableOpacity>)}

                    {this.state.show && (
                          <DateTimePicker
                          testID="dateTimePicker"
                          value={this.state.date}
                          mode={this.state.mode}
                          is24Hour={true}
                          display="default"
                          onChange={this.onChange}
                          />
                    )}

                </View>
                <TouchableOpacity style={styles.addButton} onPress={this.goToAddDetails}>
                      <Text style={{color:'white'}}>เพิ่มรายละเอียด</Text>
                </TouchableOpacity>
                
                
                 
                  
              </ScrollView>)
            
              
              
          )
  }

}

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
  },
    buttonLogin: {
      
      
      marginLeft:100,
      backgroundColor:'red'
    },
    addButton:{
      justifyContent:"center",
      alignItems: "center",
      backgroundColor: "#1D3557",
      width:150,
      height:30,
      borderRadius: 20,
      marginTop:10
      
    },
    container: {
        flexGrow: 1,
        justifyContent:"center",
        alignItems: "center",
        backgroundColor:'#F1FAEE',
    },
    dropdown: {
      width:'60%',
      height: '5%',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 8,
      backgroundColor:'white'
      
    },
    placeholderStyle: {
      fontSize: 16,
    },
    selectedTextStyle: {
      fontSize: 16,
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
    },
    pickDateTimeButton:{
      justifyContent:"center",
      alignItems: "center",
      backgroundColor: "#1D3557",
      marginHorizontal:'5%',
      paddingHorizontal:'5%',
      height:30,
      width:120,
      borderRadius:20
      
    },
});

const mapStateToProps = (state) => (
  
    {pointList:state.locationReducer.pointList,order:state.orderReducer.order}
  
 
)


const mapDispatchToProps = (dispatch)=>{
  return{
    addRegion:(item)=>dispatch(addRegion(item)),
    deleteRegion:(item)=>dispatch(deleteRegion(item)),
    saveOrder:(item)=>dispatch(saveOrder(item))
  }
  
}

export default connect(mapStateToProps,mapDispatchToProps) (Home)