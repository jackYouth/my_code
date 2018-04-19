import { connect } from 'react-redux'
import { wrap, Mask } from '@boluome/oto_saas_web_app_component'
import { handleChooseContact, handleArriveTime, handleCreateCart, saveOrder, handleUserTips, handleCoupon, fetchBestContact } from '../actions/order'
import Order from '../components/order'

const mapStateToProps = ({ app, indexPage, restaurantDetail, order, addorMinusToShoppingCar }) => {
  return {
    ...app,
    ...indexPage,
    ...restaurantDetail,
    ...order,
    ...addorMinusToShoppingCar,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleChooseContact:   contact => dispatch(handleChooseContact(contact)),
  handleArriveTime:      time => dispatch(handleArriveTime(time)),
  handleCreateCart:      (props, datas) => dispatch(handleCreateCart(props, datas)),
  saveOrder:             props => dispatch(saveOrder(props)),
  handleUserTips:        tips => dispatch(handleUserTips(tips)),
  handleCoupon:          reply => dispatch(handleCoupon(reply)),
  handleOrderPageScroll: target => {
    const targetScrollTop = target.scrollTop
    const topHeight = getComputedStyle(target.childNodes[0]).height.substring(0, getComputedStyle(target.childNodes[0]).height.length - 2)
    // console.log('target', targetScrollTop, topHeight, getComputedStyle(target.childNodes[0]).height.length)
    if (targetScrollTop > topHeight) {
      dispatch({ type: 'SHOW_BOTTOMADDRESS', showBottomAddress: 1 })
    } else {
      dispatch({ type: 'SHOW_BOTTOMADDRESS', showBottomAddress: 0 })
    }
  },
})

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    // console.log('state', state)
    const { addressResult, beLocation, chooseContact } = state
    dispatch({ type: 'SHOW_BOTTOMADDRESS', showBottomAddress: 0 })
    if (chooseContact && !beLocation) {
      console.log('123')
      dispatch(handleCreateCart(state, chooseContact))
    } else if (addressResult && !beLocation) {
      console.log('333')
      dispatch(handleCreateCart(state, addressResult))
    } else if (!chooseContact && !addressResult && !beLocation) {
      console.log('is else')
      // 根据用户定位创建购物车
      dispatch(fetchBestContact(state))
      // dispatch(handleCreateCart(state))
      // dispatch(handleCreateCart(state))
    } else {
      console.log('special', chooseContact, addressResult, beLocation)
      dispatch(handleCreateCart(state, 'notHere'))
    }
  },
  componentWillUnmount: () => {
    Mask.closeAll()
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Order)
  )
