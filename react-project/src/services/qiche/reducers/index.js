import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import air  from './air'
import order  from './order'
import orderDetails  from './orderDetails'
// 组合reducers
export default combineReducers({
  app, air, order, orderDetails,
})
