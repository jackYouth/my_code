// common
import { connect } from 'react-redux'
import { wrap, SlidePage, Mask } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
// import { browserHistory } from 'react-router'
import { setStore, getStore } from '@boluome/common-lib'
import { getOrderTime, getOrder, getAddrContact, handleChangeContact } from '../actions/order.js'
import Order from '../components/Order'

const mapStateToProps = state => {
  const { getDetailsData, order } = state
  const { contact, timeData, serviceDate, sum, curDiscountData, disabled, point } = order
  // console.log('state----', state)
  return {
    getDetailsData,
    order,
    timeData,
    serviceDate,
    contact,
    sum,
    curDiscountData,
    disabled,
    point,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    // handleGoContactList: (contact, sum) => {
    //   dispatch(handleChangeContact(contact, sum))
    //   browserHistory.push('/jiadianqingxi/contactlist')
    // },
    // 返回的选择收货地址
    handleChangeContactFnList: (contact, sum) => {
      setStore('Choosecontact', contact, 'session')
      dispatch(handleChangeContact(contact, sum))
    },
    // 这里是家电清洗的购买数量的加减
    changeSum: (sum, contact) => {
      if (sum < 1) sum = 1
      dispatch({ type: 'CHANGE_NUMBER', sum })
      if (contact) { // 根据经纬度判断服务时间
        const latOrlong = {
          latitude:  contact.latitude,
          longitude: contact.longitude,
          cityId:    contact.cityId,
        }
        dispatch(getOrderTime(latOrlong, sum))
      } else {
        dispatch({ type: 'MARK_ORDERBTN', disabled: false })
      }
    },
    // 通过收货地址经纬度判断该城市是否存在服务在请求服务时间
    handleChangeServiceDate: serviceDate => {
      console.log('handleChangeServiceDate---', serviceDate)
      if (!serviceDate || serviceDate === '') {
        dispatch({ type: 'MARK_ORDERBTN', disabled: false })
      } else {
        dispatch({ type: 'CHOOSE_SERVICETIME', serviceDate })
        dispatch({ type: 'MARK_ORDERBTN', disabled: true })
      }
    },
    // 对红包优惠活动的处理
    handlePromotionChange: curDiscountData => {
      dispatch({ type: 'KJIN_PROMOTION', curDiscountData })
    },
    // 确认下单，需求修改在此处登录成功后再下单
    orderSubmit: (detailsData, sum, contact, time, curDiscountData, point) => {
      if (time) {
        dispatch(getOrder(detailsData, sum, contact, time, curDiscountData, point))
      } else {
        Toast.info('请选择服务时间', 2)
      }
    },
    showToastNoMask: () => {
      const contact = getStore('Choosecontact', 'session')
      if (contact) {
        Toast.info('该地区无服务', 2, null, false)
      } else {
        Toast.info('请填写服务地址', 2, null, false)
      }
    },
  }
}

const mapFunToComponent  = dispatch => ({
// componentDidMount: () => console.log('root mounted')
  componentWillMount: () => {
    dispatch(getAddrContact())
  },
  componentWillUnmount: () => {
    SlidePage.closeAll()
    Mask.closeAll()
  },
})
export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Order)
)
