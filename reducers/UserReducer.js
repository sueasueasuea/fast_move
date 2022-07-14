import {ADD_USER,START_CHAT} from '../actions/Types'

const intialState = {
 user:{
    id:1,
    username:'test',
    firstname:'test',
    lastname:'test',
    phone:'12234',
    email:'test',
    time:'test'
 },
 chatid:''
}



const userReducer=(state = intialState,action)=>{
   switch(action.type){
     case ADD_USER:
      return{
        ...state,user:{
          id:action.id,
          username:action.username,
          firstname:action.firstname,
          lastname:action.lastname,
          phone:action.phone,
          email:action.email,
          time:action.time
        }
      }
      case START_CHAT:
      return {
        ...state,chatid: action.id
      }
    default:
      return state
   }
 }

 export default userReducer