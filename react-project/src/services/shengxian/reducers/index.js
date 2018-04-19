import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import detail  from './detail'
import order  from './order'
import addr  from './addr'
import sear  from './sear'
import orderDetails  from './orderDetails'
// 组合reducers
export default combineReducers({
  app, detail, order, addr, sear, orderDetails,
})
