import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import moredata from './moredata'
import details from './details'
import order from './order'
import orderDetails from './orderDetails'
import grabticket from './grabticket'
import ordergrab from './ordergrab'
import refund from './refund'

// 组合reducers
export default combineReducers({
  app,
  moredata,
  details,
  order,
  orderDetails,
  grabticket,
  ordergrab,
  refund,
})
