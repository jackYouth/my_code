import { combineReducers } from 'redux'
// 引入reducers
import app  from './app'
import main  from './main'
import market  from './main/market'
import daojia  from './main/daojia'
import specialty  from './main/specialty'
import categories  from './main/categories'
import commodityList  from './common-component/commodity-list'
import commodityDetail  from './main/commodity-detail'
import brand  from './brand'
import cart  from './cart'
import userCenter  from './user-center'
import order  from './user-center/order'
import orderList  from './user-center/order-list'
import collectList  from './user-center/collect-list'
import attentionList  from './user-center/attention-list'
import evaluate  from './evaluate'
import refundList  from './user-center/refund-list'
import refund  from './refund'
import refundInfo  from './refund/refund-info'
// massge
import message  from './message'
// activity
import yearActivity from './activity/year-activity'
import ttth from './activity/ttth'

// 组合reducers
export default combineReducers({
  app,
  main,
  market,
  daojia,
  cart,
  userCenter,
  specialty,
  categories,
  commodityList,
  commodityDetail,
  brand,
  order,
  orderList,
  collectList,
  attentionList,
  evaluate,
  refundList,
  refund,
  refundInfo,
  message,
  yearActivity,
  ttth,
})
