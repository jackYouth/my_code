import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import indexPage from './index-page'
import filter from './filter'
import restaurantDetail from './restaurantDetail'
import order from './order'
import addorMinusToShoppingCar from './addorMinusToShoppingCar'
import orderDetails from './orderDetails'
import searchProps from './search'
// 组合reducers

export default combineReducers({
  app, indexPage, filter, restaurantDetail, order, addorMinusToShoppingCar, orderDetails, searchProps,
})
