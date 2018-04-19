import { connect }           from 'react-redux'
import { wrap, Mask }              from '@boluome/oto_saas_web_app_component'
import { parseQuery, getStore }        from '@boluome/common-lib'
import { browserHistory } from 'react-router'
import moment from 'moment'
import { Toast } from 'antd-mobile'
import Order                 from '../components/order'
import { handleBill, saveOrder, handleLastestArrivalTime, goGuarant, handleChooseRoomQuantity, handleAvail, handleArriveTime, handleCoupon, handleCustomerName, handleCustomerPhone } from '../actions/order'
import { handleFetchDetail } from '../actions/details'

const mapStateToProps = ({ app, condition, hotelList, detail, order }) => {
  return {
    ...app,
    ...condition,
    ...hotelList,
    ...detail,
    ...order,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch,
  handleChooseRoomQuantity: (q, s, props) => dispatch(handleChooseRoomQuantity(q, s, props)),
  handleArriveTime:         (t, p) => {
    const time = t[0].split(' ')[0]
    const dateInfo = getStore('dateInfo')
    const { startDate } = dateInfo
    const lastestArriveTime = `${ startDate } ${ time }`
    console.log(lastestArriveTime)
    dispatch(handleArriveTime(t, p))
    dispatch(handleLastestArrivalTime(lastestArriveTime))
    if ((/担保金/).test(t[0])) {
      dispatch(goGuarant(true))
    } else {
      dispatch(goGuarant(false))
    }
  },
  handleCoupon:        reply => dispatch(handleCoupon(reply)),
  handleCustomerPhone: n => dispatch(handleCustomerPhone(n)),
  handleBill:          res => dispatch(handleBill(res)),
  handleCustomerName:  (i, e, customerName) => dispatch(handleCustomerName(i, e, customerName)),
  checkInfo:           info => {
    const { isGoGuarantee, customerName = [], quantity = 1, customerPhone = getStore('userPhone', 'session'), choosenArriveTime = [] } = info
    let noName = false
    customerName.forEach(i => {
      if (i === '') {
        // customerName.splice(idx, 1)
        noName = true
      }
    })
    if (customerName.length !== Number(quantity) || noName) {
      Toast.info('请输入入住人姓名', 2)
    } else if (customerPhone.length !== 11) {
      Toast.info('请输入正确手机号', 2)
    } else if (choosenArriveTime.length <= 0) {
      Toast.info('请选择到店时间')
    } else if (isGoGuarantee) {
      browserHistory.push('/jiudian/guarantee')
    } else {
      saveOrder(info)
    }
  },
})

const mapFunToComponent = (dispatch, state) => ({
  componentWillMount: () => {
    const { orderCityId, choosenArriveTime = [], chooseCity = {}, currentCityId = getStore('currentCityId') } = state
    const dateInfo = getStore('dateInfo')
    const { startDate, endDate } = dateInfo
    const search = parseQuery(location.search)
    const { hotelId, roomId, planId } = search
    const HotelIds = String(hotelId)
    const { id } = chooseCity
    const postData = {
      HotelIds,
      channel:       getStore('channel'),
      ArrivalDate:   startDate,
      DepartureDate: endDate,
      cityId:        !orderCityId ? !id ? currentCityId : id : orderCityId,
    }
    if ((/担保金/).test(choosenArriveTime[0])) {
      dispatch(goGuarant(true))
    } else {
      dispatch(goGuarant(false))
    }
    let lastestArriveTime
    if (moment().format('YYYY-MM-DD') === startDate) {
      lastestArriveTime = moment().add(1, 'hours').format('YYYY-MM-DD HH:00')
    } else {
      lastestArriveTime = moment(startDate).add(1, 'hours').format('YYYY-MM-DD 14:00')
    }

    dispatch({ type: 'SHOW_ROOMEID', showRoomID: roomId })
    dispatch({ type: 'PLAN_ID', planId })
    dispatch(handleAvail(state))
    dispatch(handleFetchDetail(postData))
    // dispatch(goGuarant(false))
    dispatch(handleLastestArrivalTime(lastestArriveTime))
  },
  componentWillUnmount() {
    Mask.closeAll()
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Order)
)
