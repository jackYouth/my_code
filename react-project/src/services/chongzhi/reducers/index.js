import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import huafei from '../../huafei/reducers/huafei'
import liuliang from '../../liuliang/reducers/liuliang'

// 组合reducers
export default combineReducers({
  app, huafei, liuliang,
})
