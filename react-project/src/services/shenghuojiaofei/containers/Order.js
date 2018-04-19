/*
  bug:优惠点击的事件，没有区分是平台活动还是红包，默认选的都是红包

  线上环境：/promotion/query_promotions 处取消header头中的appcode
  userId改为联合登陆userId
*/


//  引入react创建组件，connect将数据注入到组件中，引入子组件

import { connect } from 'react-redux'

import Order from '../components/Order'
import { changeOrder } from '../actions/order.js'

//  定义变量
const mapStateToProps = (state, props) => {
  const { order } = state
  const { currentServer, currentOrg, orderInfo, queryInfo, currentBillInfo } = props

  return {
    ...order,
    currentServer,
    currentOrg,
    orderInfo,
    queryInfo,
    currentBillInfo,
  }
}

// 定义函数，函数中其实就是定义dispatch方法的使用
const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleOrder:           paras => dispatch(changeOrder(paras)),    // data中传过来的是一个数组[orderData, currentOrg],orderData代表的是请求下单参数，currentOrg代表请求成功后，保存到本地的数据
    handlePromotionChange: curDiscountData => dispatch({ type: 'CHANGE_DISCOUNT', curDiscountData }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Order)
