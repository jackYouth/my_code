import { combineReducers } from 'redux'
// 引入reducers
import getListData  from './getListData'
import getDetailsData  from './details'
import order from './order'
// 组合reducers
export default combineReducers({
  getListData,
  getDetailsData,
  order,
})
