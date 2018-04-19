import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { wrap, Mask }    from '@boluome/oto_saas_web_app_component'
import { getStore, setStore, week, moment } from '@boluome/common-lib'
import Ordergrab         from '../components/ordergrab'
import getDateOne from '../components/getDateOne'
import getDateArr from '../components/getDateArr'
// 订单页面的数据请求
import { AccidentFn, OrderSaveGrab } from '../actions/order'

const mapStateToProps = state => {
  console.log(state)
  const { ordergrab } = state
  return {
    ...ordergrab,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleCalendarDate: res => {
      console.log('handleCalendarDate----', res)
      const { date, datestr } = res
      const time = `${ date.split('-')[1] }月${ date.split('-')[2] }日`
      const weed = getDateOne(res) ? getDateOne(res) : week()(moment('day')(date))
      const chooseTime = {
        dateShow: time,
        datestr,
        weed,
        date,
      }
      setStore('huoche_ChooseTime', chooseTime, 'session')
      dispatch({ type: 'CALENDAR_TIME', chooseTime })
      const timearr = getDateArr(chooseTime)
      setStore('huoche_timearr', timearr, 'session')
      dispatch({ type: 'TIME_CHOOSE_ARR', timearr })
      Mask.closeAll()
      location.hash = ''
    },
    // 这里实时改变备选坐席的
    handleHavechooseTrain: (chooseZuowei, chooseTrain, chooseSeat, startTime) => {
      dispatch({ type: 'HAVE_CHOOSE_TRAIN', chooseZuowei, chooseTrain, chooseSeat, startTime })
    },
    // 接收最大价格参数
    handleMaxPrice: (price, maxpriceObj, haveChooseZuo) => {
      // setStore(huoche_packagePrice)
      dispatch({
        type:     'MAX_PRICE',
        maxprice: price,
        maxpriceObj,
        haveChooseZuo,
      })
    },
    // 处理是否需要保险
    handleNeedAccident: (checked, res) => {
      console.log('handleNeedAccident---', checked, res)
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
      dispatch({ type: 'TOURISTNUMBER', touristNumer })
    },
    // 处理优惠活动价钱
    handlePromotion: v => {
      dispatch({ type: 'PROMOTION', promotion: v })
    },
    // 处理电话号码
    handlePhone: v => {
      const phone = v.replace(/\s/g, '')
      dispatch({ type: 'PHONE', phone })
      setStore('huoche_phone', phone, 'session')
    },
    // 处理联系人姓名
    handleName: v => {
      dispatch({ type: 'NAME', name: v })
      setStore('huoche_name', v, 'session')
    },
    // 接收组件传来的备选日期
    // handleGetchooseTrain:
    // 符合保存订单
    handleOrderSave: (promotion, touristNumer, phone, chooseTime, name, chooseCity, checkAccient, timearr, chooseSeat, chooseArrtime, haveChooseZuo, startTime, haschecked) => {
      console.log('dddd', promotion, touristNumer, phone)
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
      const len = touristNumer.filter(e => e.type === 1)
      if (len <= 0) {
        Toast.info('请选择至少一个成人', 2)
        return
      }
      dispatch(OrderSaveGrab(promotion, touristNumer, phone, chooseTime, name, chooseCity, checkAccient, timearr, chooseSeat, chooseArrtime, haveChooseZuo, startTime, haschecked))
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
    const seatsDataGrab = getStore('huoche_seatsData_grab', 'session')
    dispatch({ type: 'TICKETDETAILS', ticketDetails, seatsDataGrab })
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
    // 日期串联
    const chooseCity = getStore('huoche_ChooseCity', 'session')
    // 联系人号码/姓名
    const phone = getStore('huoche_phone', 'session')
    dispatch({ type: 'PHONE', phone })
    const name = getStore('huoche_name', 'session')
    dispatch({ type: 'NAME', name })
    // 手续费用的获取
    const withoutDiscountedPrice = getStore('huoche_withoutDiscountedPrice', 'session')
    dispatch({ type: 'WITHOUTDISCOUNTED_PRICE', withoutDiscountedPrice })
    console.log('test---withoutDiscountedPrice', withoutDiscountedPrice)
    // 抢票需要的价格，按照最大价格计算
    const maxprice = getStore('huoche_maxprice', 'session')
    const maxpriceObj = getStore('huoche_maxpriceObj', 'session')
    dispatch({ type: 'MAX_PRICE', maxprice, chooseCity, maxpriceObj })
    // 总会抢票备选信息
    const timearr = getStore('huoche_timearr', 'session')
    const chooseSeat = getStore('huoche_chooseSeat', 'session')
    const chooseArrtime = getStore('huoche_chooseArrtime', 'session')
    const haveChooseZuo = getStore('huoche_haveChooseZuo', 'session')
    const startTime = getStore('huoche_startTime', 'session')
    const chooseTrain = getStore('huoche_chooseTrain', 'session')
    const packagePrice = getStore('huoche_packagePrice', 'session')
    dispatch({ type: 'GRAB_DATA', timearr, chooseArrtime, haveChooseZuo })
    dispatch({ type: 'HAVE_CHOOSE_TRAIN', chooseSeat, startTime, chooseTrain })
    dispatch({ type: 'SPEED_DATA', packagePrice })
    // 保险
    const checkAccient = getStore('huoche_checkAccient', 'session')
    const haschecked = getStore('huoche_haschecked', 'session')
    dispatch({ type: 'ORDER_CHECKED', checkAccient, haschecked })
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
  wrap(mapFunToComponent)(Ordergrab)
)
