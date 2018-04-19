import { combineReducers } from 'redux'
// 引入reducers
import channel  from './channel'
import product  from './product'
import invoiceInfo  from './invoice-info'
import orderId  from './orderId'
import cancelReason  from './order-cancel'
import stroke  from './stroke'
// 组合reducers
export default combineReducers({
  channel,
  product,
  invoiceInfo,
  orderId,
  cancelReason,
  stroke,
})
