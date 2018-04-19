import { combineReducers } from 'redux'
//引入reducers
import app  from './app'
import firstDate from './firstDate'
import result from './result'
import carType from './carType'
//组合reducers
export default combineReducers({
  app,
  firstDate,
  result,
  carType
})
