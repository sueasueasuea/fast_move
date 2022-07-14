import userReducer from './reducers/UserReducer'
import locationReducer from './reducers/LocationReducer'
import orderReducer from './reducers/OrderReducer';
import { createStore, combineReducers } from 'redux';


const rootReducer = combineReducers({
  userReducer: userReducer,
  locationReducer: locationReducer,
  orderReducer:orderReducer
})

const configureStore = createStore(rootReducer);
export default configureStore;