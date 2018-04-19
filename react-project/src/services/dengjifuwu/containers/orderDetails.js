import { connect }     from 'react-redux'
import { wrap, Mask }        from '@boluome/oto_saas_web_app_component'
import { login } from 'business'
import { getStore } from '@boluome/common-lib'
import OrderDetails       from '../components/orderDetails'


const mapStateToProps = ({ app, detail, order, orderDetails }) => {
  return {
    ...app,
    ...detail,
    ...order,
    ...orderDetails,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
})

const mapFunToComponent = dispatch => ({
  componentWillMount: () => {
    const customerUserId = getStore('customerUserId', 'session')
    if (!customerUserId) {
      login(err => {
        if (err) {
          console.log('login in orderDetails is err', err)
        } else {
          console.log('login in orderDetails is success')
          const { pathname } = window.location
          const id = pathname.split('/')[3]
          dispatch({ type: 'ORDER_ID', orderId: id })
        }
      })
    } else {
      console.log('has user info')
      const { pathname } = window.location
      const id = pathname.split('/')[3]
      dispatch({ type: 'ORDER_ID', orderId: id })
    }
  },
  componentWillUnmount: () => {
    Mask.closeAll()
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(OrderDetails)
)
