import {ADD_REGION,EDIT_REGION,RESET_REGION,DELETE_REGION} from '../actions/Types'

const intialState = {
 pointList:[]
}

let point_number = 0;


const locationReducer=(state = intialState,action)=>{

   switch(action.type){
     case ADD_REGION:
         //console.log('come')
         const point_number2 = ++point_number;
      return{
        ...state,pointList:[...state.pointList,{id:point_number2,region:action.region,address:action.address,index:action.index
                                                ,phonenumber:action.phonenumber,details:action.details}]
        }
     case RESET_REGION:
      return{
         ...state,pointList:[]
         }
     case EDIT_REGION:
            let pointListcopie = JSON.parse(JSON.stringify(state.pointList));
            pointListcopie[action.index] = {id:pointListcopie[action.index].id,address : action.address,region:action.region
                                                               ,phonenumber:action.phonenumber,details:action.details}

      return{
            ...state,pointList:pointListcopie
          }
      case DELETE_REGION:
         
            let pointListcopie2 = JSON.parse(JSON.stringify(state.pointList));
            pointListcopie2[action.index] = {id:pointListcopie2[action.index].id,address:'',region:{},phonenumber:'',details:''}
      return{
         ...state,pointList:pointListcopie2
      }

    default:
      return state
   }
 }

 export default locationReducer