
import {SAVE_ORDER,EDIT_MORE_ORDER,ADD_DIST_DURA_PRICE_TO_ORDER,ADD_GNOME_ORDER} from '../actions/Types'

const intialState = {
 order:{},
 
}

let order_number =0;

const orderReducer=(state = intialState,action)=>{

   switch(action.type){
      
     case SAVE_ORDER:
         console.log('come save_order')
         var order_number2=++order_number;
         if(order_number2>10)
         {
          order_number2=10
         }
      return{
        
          ...state,order:{
            id:order_number2,
            getTime: action.getTime,
            wayPointList:action.wayPointList,
            gnome:'',
            details:'',
            phone:'',
            price:0
          }
        }
    case EDIT_MORE_ORDER:
      let ordercopie = JSON.parse(JSON.stringify(state.order));

      order ={id:ordercopie.id,getTime:ordercopie.getTime,wayPointList:ordercopie.wayPointList
         ,details:action.lastDetails,phone
         :action.customerPhone,price:action.price,
        gnome:ordercopie.gnome}
       return{
        ...state,order:order
        }
    case ADD_DIST_DURA_PRICE_TO_ORDER:
      let ordercopie2 = JSON.parse(JSON.stringify(state.order));
      
      order ={id:ordercopie2.id,getTime:ordercopie2.getTime,wayPointList:ordercopie2.wayPointList
        ,details:ordercopie2.details,phone
        :ordercopie2.phone,price:action.price,gnome:ordercopie2.gnome,distance:action.distance,duration:action.duration}
      return{
          ...state,order:order
        }
    case ADD_GNOME_ORDER:
      console.log('come case add_gnome_order')
      console.log('action gnome',action.gnome)
          let ordercopie3 = JSON.parse(JSON.stringify(state.order));
          order ={id:ordercopie3.id,getTime:ordercopie3.getTime,wayPointList:ordercopie3.wayPointList,gnome:action.gnome
            ,details:ordercopie3.details,phone
            :ordercopie3.phone,price:ordercopie3.price,distance:ordercopie3.distance,duration:ordercopie3.duration}
          console.log('order in case add gnome',order)
      return{
          ...state,order:order
          }
     default:
       console.log('defualt case')
      return state
    
  }
   
 }

 export default orderReducer