import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { Login } from 'business'
import orderDetails         from '../components/orderDetails'

const mapStateToProps = state => {
  console.log(state.orderDetails)
  return {
    ...state.orderDetails,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    goBackIndex: shop => {
      const { shopId } = shop
      // setStore('currentShop', shop, 'session')
      browserHistory.push(`/baoyang/${ shopId }/detail`)
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    if (getStore('customerUserId', 'session')) {
      console.log('已用户绑定')
    } else {
      Login(err => {
        if (err) {
          console.log('在此用户绑定失败')
        } else {
          console.log('用户绑定成功')
        }
      }, true)
    }
  },
  componentDidMount: () => console.log('root mounted', dispatch),
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(orderDetails)
)
