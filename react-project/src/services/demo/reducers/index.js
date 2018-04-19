import { combineReducers } from 'redux'
// 引入reducers

import app from './app'
import page1 from './page1'
import page2 from './page2'

// 组合reducers
export default combineReducers({
  app,
  page1,
  page2,
})

// 这块会通用出来
