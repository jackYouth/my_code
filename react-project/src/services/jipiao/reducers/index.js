import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import air  from './air'
import detail  from './detail'
import order  from './order'
import refund  from './refund'
import change  from './change'
import changeord  from './changeord'
import changeup  from './changeup'
import refundup  from './refundup'
import remail  from './remail'
import orderDetails  from './orderDetails'
// 组合reducers
export default combineReducers({
  app, air, detail, order, refund, change, remail, orderDetails, changeord, changeup, refundup,
})
