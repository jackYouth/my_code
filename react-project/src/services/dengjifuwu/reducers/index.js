import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import detail from './Detail'
import order from './order'
import orderDetails from './orderDetails'
// 组合reducers
export default combineReducers({
  app, detail, order, orderDetails,
})
