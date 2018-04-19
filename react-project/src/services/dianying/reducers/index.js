import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import searchall  from './searchall'
import searchcin  from './searchcin'
import detail  from './detail'
import cinema from './cinema'
import select from './select'
import getseat from './getseat'
import order from './order'
import addr from './addr'
import picture from './picture'
import orderDetails  from './orderDetails'
// 组合reducers
export default combineReducers({
  app, detail, cinema, select, getseat, order, addr, picture, orderDetails, searchall, searchcin,
})
