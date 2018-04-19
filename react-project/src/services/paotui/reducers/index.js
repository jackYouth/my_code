import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import order from './order'
// 组合reducers
export default combineReducers({
  app, order,
})
