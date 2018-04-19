import { combineReducers } from 'redux'

// 引入reducers
import app  from './app'
import details  from './details'
import Picshow  from './picshow'
import order from './order'
import search from './search'
// 组合reducers
export default combineReducers({
  app, details, Picshow, order, search,
})
