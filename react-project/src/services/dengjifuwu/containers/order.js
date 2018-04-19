import { connect }            from 'react-redux'
import { wrap }               from '@boluome/oto_saas_web_app_component'
import { getStore }           from '@boluome/common-lib'
import { returnThisData }  from '../actions/Detail'
import { handleCoupon, saveOrder }  from '../actions/order'
import Order                 from '../components/order'

const mapStateToProps = ({ app, detail, order }) => ({ ...app, ...detail, ...order })

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleCoupon: orderDiscount => (dispatch(handleCoupon(orderDiscount))),
  saveOrder:    props => (dispatch(saveOrder(props))),
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    console.log('state', state)
    let { thisData } = state
    if (!thisData) {
      thisData = getStore('thisData', 'session')
      console.log('thisDatas', thisData)
      dispatch(returnThisData(thisData))
    } else {
      console.log('order  componentWillMount')
      dispatch(returnThisData(thisData))
    }
    // document.title = '订单确认'
  },
  componentWillUnmount: () => {
    console.log('order page will Unmount')
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Order)
)
