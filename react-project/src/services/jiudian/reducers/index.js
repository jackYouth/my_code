import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import condition  from './condition'
import hotelList from './hotelList'
import detail from './details'
import order from './order'
import guarantee from './guarantee'
import orderDetails from './orderDetails'
// 组合reducers
export default combineReducers({
  app, condition, hotelList, detail, order, guarantee, orderDetails,
})
