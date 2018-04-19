import { combineReducers } from 'redux'
// 引入reducers
import app     from './app'
import detail  from './detail'
import confirm from './confirm'
// 组合reducers
export default combineReducers({
  app,
  detail,
  confirm,
})
