import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import detail  from './detail'
import addr from './addr'
import select from './select'
import order from './order'
import orderDetails  from './orderDetails'
// 组合reducers
export default combineReducers({
  app, detail, addr, select, order, orderDetails,
})
