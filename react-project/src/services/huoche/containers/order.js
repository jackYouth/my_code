import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'
import Order         from '../components/order'

// 订单页面的数据请求
import { AccidentFn, OrderSave } from '../actions/order'

const mapStateToProps = state => {
  console.log(state)
  const { order } = state
  return {
    ...order,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleCalendarDate: date => {
      console.log('handleCalendarDate----', date)
    },
    // 处理是否需要保险
    handleNeedAccident: (checked, res) => {
      console.log('handleNeedAccident---', checked)
      let checkAccient = ''
      if (checked) {
        checkAccient = res
      }
      dispatch({ type: 'ORDER_CHECKED', haschecked: checked, checkAccient })
      setStore('huoche_checkAccient', checkAccient, 'session')
      setStore('huoche_haschecked', checked, 'session')
    },
    // 处理购票人信息
    handleChangeTourNum: touristNumer => {
      dispatch({ type: 'TOURISTNUMBER', touristNumer })
    },
    // 同步购票人数
    changeTouristNumer: touristNumer => {
      console.log('--changeTouristNumer--', touristNumer)
      dispatch({ type: 'TOURISTNUMBER', touristNumer })
    },
    // 处理优惠活动价钱
    handlePromotion: v => {
      dispatch({ type: 'PROMOTION', promotion: v })
    },
    // 处理电话号码
    handleName: v => {
      // console.log('name--', v)
      dispatch({ type: 'NAME', name: v })
      setStore('huoche_name', v, 'session')
    },
    // 处理电话号码
    handlePhone: v => {
      // console.log('phone--', v)
      const phone = v.replace(/\s/g, '')
      dispatch({ type: 'PHONE', phone })
      setStore('huoche_phone', phone, 'session')
    },
    // 符合保存订单
    handleOrderSave: (promotion, touristNumer, seatsChoose, ticketDetails, phone, chooseTime, name, checkAccient, ChangeSign, details, haschecked) => {
      console.log('dddd', promotion, touristNumer, seatsChoose, ticketDetails, phone, ChangeSign, details)
      if (!name) {
        Toast.info('请填写联系人', 2)
        return
      }
      if (!phone) {
        Toast.info('请填写手机号', 2)
        return
      }

      const tel = phone.replace(/\s/g, '')
      if (!(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/.test(tel))) {
        Toast.info('请填写正确手机', 2)
        return
      }
      console.log('--handleOrderSave--', touristNumer)

      if (ChangeSign && details) {
        dispatch(OrderSave(promotion, touristNumer, seatsChoose, details, tel, chooseTime, name, checkAccient, ChangeSign, haschecked))
      } else {
        const len = touristNumer.filter(e => e.type === 1 || e.passengerType === '成人票')
        if (len <= 0) {
          Toast.info('请选择至少一个成人', 2)
          return
        }
        dispatch(OrderSave(promotion, touristNumer, seatsChoose, ticketDetails, tel, chooseTime, name, checkAccient, ChangeSign, haschecked))
      }
    },
    goOrderFn: () => {
      browserHistory.push('/huoche/order')
    },
    handleOrderDetails: () => {
      browserHistory.push('/huoche/orderDetails')
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    // 所购买票的信息
    const ticketDetails = getStore('huoche_details', 'session')
    dispatch({ type: 'TICKETDETAILS', ticketDetails })
    // 购买的座位信息
    const seatsChoose = getStore('huoche_seats', 'session')
    dispatch({ type: 'SEATSCHOOSE', seatsChoose })
    // 乘客信息部分
    const touristNumer = getStore('TOURISTNUMBER', 'session')
    if (touristNumer) {
      dispatch({ type: 'TOURISTNUMBER', touristNumer })
    } else {
      setStore('TOURISTNUMBER', [], 'session')
      dispatch({ type: 'TOURISTNUMBER', touristNumer: [] })
    }
    // 日期串联
    const chooseTime = getStore('huoche_ChooseTime', 'session')
    dispatch({ type: 'CALENDAR_TIME', chooseTime })
    // 联系人号码
    const phone = getStore('huoche_phone', 'session')
    dispatch({ type: 'PHONE', phone })
    // 联系人号码
    const name = getStore('huoche_name', 'session')
    dispatch({ type: 'NAME', name })
    // 手续费用的获取
    const withoutDiscountedPrice = getStore('huoche_withoutDiscountedPrice', 'session')
    dispatch({ type: 'WITHOUTDISCOUNTED_PRICE', withoutDiscountedPrice })
    // 保险
    const checkAccient = getStore('huoche_checkAccient', 'session')
    const haschecked = getStore('huoche_haschecked', 'session')
    dispatch({ type: 'ORDER_CHECKED', checkAccient, haschecked })
    // 改签时用到的数据
    const propsObj = getStore('huoche_Change_data', 'session')
    const details = getStore('huoche_details', 'session') ? getStore('huoche_details', 'session') : ''
    const passengersChoose = getStore('huoche_passengersChoose', 'session')
    const seats = getStore('huoche_seats', 'session')
    const ChangeSign = location.search
    const partnerId = getStore('huoche_ChangeSign_partnerId', 'session')
    if (propsObj) {
      dispatch({ type: 'CHANGE_DATA_SIGN', details, propsObj, ChangeSign, passengersChoose, seats, partnerId })
    }
    // 判断是否是包商
    const host = location.host
    if (host.indexOf('bsb') < 0) {
      console.log('不是包商')
      dispatch({ type: 'IS_BSB', isBsb: true })
    } else {
      dispatch({ type: 'IS_BSB', isBsb: false })
      dispatch({ type: 'ORDER_CHECKED', haschecked: false })
      setStore('huoche_haschecked', false, 'session')
    }
    // 判断供应商 channel
    const channel = getStore('huoche_channel', 'session')
    dispatch({ type: 'HUOCHE_CHANNEL', channel })
  },
  componentDidMount: () => {
    dispatch(AccidentFn())
    // console.log(dispatch, AccidentFn)
  },
  componentWillUnmount: () => {
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Order)
)
