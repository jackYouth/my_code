import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import carType from './carType'
import addCar from './addCar'
import editCar from './editCar'

// 组合reducers
export default combineReducers({
  app,
  carType,
  addCar,
  editCar,
})
