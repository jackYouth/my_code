import { connect }    from 'react-redux'
import { wrap, Mask } from '@boluome/oto_saas_web_app_component'
// import { getStore }   from '@boluome/common-lib'
// import { login }      from 'business'
import OrderDetails   from '../components/orderDetails'

const mapStateToProps = ({ GetOilChannel, GetCardsList, GetOilPrice, ShowInfo, DiscountPrice, Choosen, categoryId, orderDetails }) => {
  return {
    ...GetOilChannel,
    ...GetCardsList,
    ...GetOilPrice,
    ...ShowInfo,
    ...Choosen,
    ...categoryId,
    ...DiscountPrice,
    ...orderDetails,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    // const customerUserId = getStore('customerUserId', 'session')
    // if (!customerUserId) {
    //   login(err => {
    //     if (err) {
    //       console.log('login in orderDetails is err', err)
    //     } else {
    //       const { params = {} } = state
    //       const { id } = params
    //       dispatch({ type: 'ORDER_ID', orderId: id })
    //     }
    //   })
    // } else {
    //   const { params = {} } = state
    //   const { id } = params
    //   dispatch({ type: 'ORDER_ID', orderId: id })
    // }
    const { params = {} } = state
    const { id } = params
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
