import { connect }     from 'react-redux'
import { wrap, Mask }        from '@boluome/oto_saas_web_app_component'
// import { getStore }           from '@boluome/common-lib'
// import { login } from 'business'
import OrderDetails       from '../components/orderDetails'
import { getOrderInfo } from '../actions/orderDetails'

const mapStateToProps = ({ app, condition, hotelList, detail, order, guarantee, orderDetails }) => {
  return {
    ...app,
    ...condition,
    ...hotelList,
    ...detail,
    ...order,
    ...guarantee,
    ...orderDetails,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  getOrderInfo: i => dispatch(getOrderInfo(i)),
})

const mapFunToComponent = dispatch => ({
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
