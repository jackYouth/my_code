import { connect } from 'react-redux'
import { wrap, Mask } from '@boluome/oto_saas_web_app_component'
import { Modal } from 'antd-mobile'
// import { getStore }           from '@boluome/common-lib'
import { get } from 'business'
// import { handleChooseContact, handleArriveTime, handleCreateCart, saveOrder, handleUserTips, handleCoupon } from '../actions/order'
import OrderDetails from '../components/orderDetails'

const alert = Modal.alert
const mapStateToProps = ({ app, indexPage, restaurantDetail, order, addorMinusToShoppingCar, orderDetails }) => {
  return {
    ...app,
    ...indexPage,
    ...restaurantDetail,
    ...order,
    ...addorMinusToShoppingCar,
    ...orderDetails,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleAftermarket: (tel, url) => {
    const { customer } = window.OTO_SAAS
    const { bridge, isSpecialPhoneCall = false } = customer
    const { specialPhoneCall } = bridge
    alert('申请退款', '商家已出餐，出餐后商家有权利拒绝您的退款申请，建议您先联系商家协商处理', [
      { text: '申请退款',
        onPress: () => {
          window.location.href = url
        } },
      { text: '联系商家',
        onPress: () => {
          if (isSpecialPhoneCall) {
            specialPhoneCall(tel)
          } else {
            window.location.href = `tel:${ tel }`
          }
        } },
    ])
  },
})

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    // const customerUserId = getStore('customerUserId', 'session')
    // if (!customerUserId) {
    //   login(err => {
    //     if (err) {
    //       console.log('login in orderDetails is err', err)
    //     } else {
    //       console.log('login in orderDetails is success')
    //       const { pathname } = window.location
    //       const id = pathname.split('/')[3]
    //       dispatch({ type: 'ORDER_ID', orderId: id })
    //     }
    //   })
    // } else {
    //   console.log('has user info')
    //   const { pathname } = window.location
    //   const id = pathname.split('/')[3]
    //   dispatch({ type: 'ORDER_ID', orderId: id })
    // }
    const { pathname } = window.location
    const id = pathname.split('/')[3]
    get(`/order/v1/waimai/${ id }/info`, {}, {}, true)
    .then(({ code, data = {}, message }) => {
      if (code === 0) {
        console.log('data------>', data)
        dispatch({ type: 'ORDER_ID', orderInfo: data })
      } else {
        console.log(message)
      }
    }).catch(err => {
      console.log(err)
    })
    dispatch({ type: 'ORDER_ID', orderId: id })
  },
  componentWillUnmount: () => {
    Mask.closeAll()
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(OrderDetails)
  )
