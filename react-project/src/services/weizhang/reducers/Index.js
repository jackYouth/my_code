// 引入combineReducers来合并多个reducers为一个主reducers
import {combineReducers} from "redux"
import home from './home'
import mycar from './mycar'
import addFlate from './addFlate'
import peccancy from './peccancy'
import condition from './condition'
import order from './order'
import second from './second'
import orderDetails  from './orderDetails'
const reducers = combineReducers({
  home, mycar, addFlate, peccancy, condition, order, second, orderDetails,
})

export default reducers
