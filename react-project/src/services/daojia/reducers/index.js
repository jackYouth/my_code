import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import detail  from './detail'
import business from './business'
import order from './order'
// 组合reducers
export default combineReducers({
  app,
  detail,
  business,
  order,
})
