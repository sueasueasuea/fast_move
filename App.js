import * as React from 'react';
import { Text, View, StyleSheet,LogBox } from 'react-native';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';

import { createStackNavigator } from '@react-navigation/stack';
import Splash from './pages/Splash'
import Login from './pages/Login'
import Recover from './pages/Recover'
import Register from './pages/Registration'
import Account from './pages/Account'
import Edit from './pages/Edit'
import LocationView from './src/LocationView'
import Home from './pages/Home'
import AddDetails from './pages/AddDetails';
import Matching from './pages/Matching';
import configureStore from './Store'
import {Provider} from 'react-redux'
import Matched from './pages/Matched';
import Chat from './pages/Chat'
import { navigationRef } from '../fast_move/src/RootNavigation.js';
import CurrentJob from './pages/CurrentJob';
import SuccessJob from './pages/SuccessJob';
import CancelJob from './pages/CancelJob';
import Full from './pages/Full'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const SplashScreen=({navigation})=>(
  <Splash navigation={navigation}/>
)

const LoginScreen=({navigation})=>(
  <Login navigation={navigation}/>
)

const RecoverScreen=({navigation})=>(
  <Recover navigation={navigation}/>
)

const RegisterScreen=({navigation})=>(
  <Register navigation={navigation}/>
)

const AccountScreen=({navigation})=>(
  <Account navigation={navigation}/>
)

const EditScreen=({navigation})=>(
  <Edit navigation={navigation}/>
)

const HomeScreen=({navigation})=>(
  <Home navigation={navigation}/>
)

const LocationViewScreen=({navigation,route})=>(
  <LocationView navigation={navigation} route={route}/>
)

const AddDetailsScreen=({navigation})=>(
  <AddDetails navigation={navigation} />
)

const MatchingScreen=({navigation,route})=>(
  <Matching navigation={navigation}route={route}/>
)


const MatchedScreen=({navigation,route})=>(
  <Matched navigation={navigation}route={route}/>
)

const ChatScreen=({navigation})=>(
  <Chat navigation={navigation}/>
)

const CurrentJobScreen=({navigation})=>(
  <CurrentJob navigation={navigation}/>
)

const SuccessJobScreen=({navigation})=>(
  <SuccessJob navigation={navigation}/>
)

const CancelJobScreen=({navigation})=>(
  <CancelJob navigation={navigation}/>
)

const FullScreen=({navigation,route})=>(
  <Full navigation={navigation}route={route}/>
)


LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"]);
LogBox.ignoreLogs(['Setting a timer']);
LogBox.ignoreLogs(['Warning: Each child']);
LogBox.ignoreLogs(['Warning: Cannot update a component']);



const TopTab = createMaterialTopTabNavigator();
const MyTopTabs=()=>{
  return(
    <TopTab.Navigator>
        <TopTab.Screen name="Current Order" component={CurrentJobScreen} />
        <TopTab.Screen name="Success Order" component={SuccessJobScreen} />
        
        
        <TopTab.Screen name="Cancel Order" component={CancelJobScreen} />
    </TopTab.Navigator>
  )
}

const Tab = createBottomTabNavigator();

const MyTabs=()=> {
  return (
    
      <Tab.Navigator>
        <Tab.Screen name="Home"
        component={HomeScreen} options={{headerStyle:{backgroundColor: '#457B9D'},tabBarLabel: 'Home',headerTitleStyle: { color: 'white' },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="border-color" size={22} color="black" />
          ),}} />
        <Tab.Screen name="History" component={MyTopTabs} options={{headerStyle:{backgroundColor: '#457B9D'},tabBarLabel: 'History',headerTitleStyle: { color: 'white' },
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={28} color="black" />
          ),}} />
        
        
        <Tab.Screen name="Account" 
        component={AccountScreen} options={{headerStyle:{backgroundColor: '#457B9D'},tabBarLabel: 'Account',headerTitleStyle: { color: 'white' },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-outline" size={28} color="black" />
          ),}} />
      </Tab.Navigator>
    
   
  );
}


const Stack = createStackNavigator();
const MyStack = ()=>(
  <Stack.Navigator>
    <Stack.Screen name='Splash' component={SplashScreen} options={{headerShown:false}}/>
    <Stack.Screen 
      name='Register' 
      component={RegisterScreen} 
      options={{ headerStyle: {backgroundColor: '#457B9D'},headerTintColor: 'white'}}/>
    <Stack.Screen 
      name='Recover' 
      component={RecoverScreen} 
      options={{ headerStyle: {backgroundColor: '#457B9D'},headerTintColor: 'white'}}/>
    
    <Stack.Screen name='Login' component={LoginScreen} options={{headerShown:false}}/>
    <Stack.Screen name='MyTabs' component={MyTabs} options={{headerShown:false}}/>
    <Stack.Screen name='LocationView' component={LocationViewScreen} options={{headerShown:false}}/>
    <Stack.Screen name='AddDetails' component={AddDetailsScreen} options={{headerShown:true,title:'AddDetails',headerStyle: { backgroundColor: '#457B9D' },headerTintColor: 'white',}}/>
    <Stack.Screen name='Matching' component={MatchingScreen} options={{headerShown:false}}/>
    <Stack.Screen name='Full' component={FullScreen}options={{headerShown:false}}/>
    <Stack.Screen name='Matched' component={MatchedScreen} options={{headerShown:false}}/>
    <Stack.Screen name='Chat' component={ChatScreen}options={{headerShown:false}}/>
    
  </Stack.Navigator>
)



export default function App() {
  return (
    <Provider store={configureStore}>
      <NavigationContainer ref={navigationRef}>
        {<MyStack />}
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: 'pink',
    padding: 8,
  }
});
