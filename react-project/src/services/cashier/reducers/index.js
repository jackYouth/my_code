import { combineReducers } from 'redux'
// 引入reducers
import cashier from './cashier'
// 组合reducers
export default combineReducers({
  cashier,
})
