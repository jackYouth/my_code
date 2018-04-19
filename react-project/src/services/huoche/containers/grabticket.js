import { connect } from 'react-redux'
import { login } from 'business'
import { Toast  } from 'antd-mobile'
import { browserHistory } from 'react-router'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { getStore, setStore, week, moment } from '@boluome/common-lib' // , removeStore
import Grabticket         from '../components/grabticket'
import { seatsDataFn } from '../actions/details'
import getDateOne from '../components/getDateOne'
import getDateArr from '../components/getDateArr'

const mapStateToProps = state => {
  console.log(state)
  const { grabticket } = state
  console.log('test---', grabticket)
  return {
    ...grabticket,
  }
}

const mapDispatchToProps = dispatch => {
  // 判断jie shu
  const handleSumTime = (timeObj, number) => {
    const { date } = timeObj
    const datesplit = date.split('-')
    const nextdate = new Date()
    nextdate.setFullYear(datesplit[0], (datesplit[1] * 1) - 1, (datesplit[2] * 1) - number)
    // const dateObj = nextdate.toLocaleDateString()
    const dateObj = `${ nextdate.getFullYear() }/${ nextdate.getMonth() + 1 }/${ nextdate.getDate() }`
    const time = dateObj.replace(/\//g, '-')
    const m = `${ dateObj.split('/')[1] > 9 ? dateObj.split('/')[1] : `0${ dateObj.split('/')[1] }` }`
    const d = dateObj.split('/')[2] > 9 ? dateObj.split('/')[2] : `0${ dateObj.split('/')[2] }`
    const t = `${ dateObj.split('/')[0] }-${ m }-${ d }`
    const dateShow = `${ m }月${ d }日`
    const weed = week()(moment('day')(time))
    const datestr = moment('x')(time)
    const chooseTime = {
      date: t,
      weed,
      datestr,
      dateShow,
    }
    dispatch({ type: 'CHOOSE_CITY', endDate: chooseTime })
    setStore('huoche_endDate', chooseTime, 'session')
    // console.log('----test3---', chooseTime)
  }
  // 计算结束时间 的日期
  const handleEndTime = (chooseTime, ticketDetails) => {
    const { duration, startTime } = ticketDetails
    const s = startTime.split(':')
    const ss = s[0] * 1 * 60
    const f = s[1] * 1
    const sum = 24 * 60
    const g = (duration * 1) + ss + f
    if (g >= sum) {
      handleSumTime(chooseTime, -1)
    } else {
      dispatch({ type: 'CHOOSE_CITY', endDate: chooseTime })
      setStore('huoche_endDate', chooseTime, 'session')
    }
  }
  return {
    dispatch,
    handleCheckedFn: v => {
      console.log('handleCheckedFn--', v)
      dispatch({ type: 'NOWCHECHED', nowChecked: v })
    },
    handleCheckedChange: reply => {
      console.log('handleCheckedChange---', reply)
    },
    // 这里是指定日期
    handleCalendarDate: res => {
      console.log('handleCalendarDate----', res)
      const { date, datestr } = res
      const ticketDetails = getStore('huoche_details', 'session') ? getStore('huoche_details', 'session') : ''
      const time = `${ date.split('-')[1] }月${ date.split('-')[2] }日`
      const weed = getDateOne(res) ? getDateOne(res) : week()(moment('day')(date))
      const chooseTime = {
        dateShow: time,
        datestr,
        weed,
        date,
      }
      if (ticketDetails) {
        handleEndTime(chooseTime, ticketDetails)
      }
      setStore('huoche_ChooseTime', chooseTime, 'session')
      dispatch({ type: 'CALENDAR_TIME', chooseTime })
      const timearr = getDateArr(chooseTime)
      console.log('timearr---', timearr)
      setStore('huoche_timearr', timearr, 'session')
      // 每当重新设置指定日期，清空展示
      setStore('huoche_chooseArrtime', [], 'session')
      setStore('huoche_alterTime', [], 'session')
      dispatch({ type: 'TIME_CHOOSE_ARR', timearr, chooseArrtime: [], alterTime: [] })
      history.go(-1)
      // Mask.closeAll()
      // location.hash = ''
    },
    // 这里实时改变备选坐席的
    handleHavechooseTrain: (chooseZuowei, chooseTrain, chooseSeat, startTime, haveChooseZuo) => {
      console.log('handleHavechooseTrain--', chooseZuowei, chooseTrain, chooseSeat, startTime)
      dispatch({ type: 'HAVE_CHOOSE_TRAIN', chooseZuowei, chooseTrain, chooseSeat, startTime })
      if (haveChooseZuo) {
        dispatch({ type: 'MAX_PRICE', haveChooseZuo })
      }
    },
    onChangeTime: time => {
      const ticketDetails = getStore('huoche_details', 'session')
      console.log('onChangeTime---', ticketDetails)
      const chooseCity = getStore('huoche_ChooseCity', 'session')
      dispatch({ type: 'CALENDAR_TIME', chooseTime: time })
      dispatch(seatsDataFn(time, chooseCity, ticketDetails))
    },
    goListFn: () => {
      browserHistory.push('/huoche/list')
    },
    goOrderFn: item => {
      setStore('huoche_seats', item, 'session')
      browserHistory.push('/huoche/order')
    },
    handleSelectTrain: (choosePrice, haveChooseZuo, chooseTrain, searchgoGrab) => {
      // console.log('test-handleSelectTrain--', choosePrice, haveChooseZuo, chooseTrain)
      if (chooseTrain && chooseTrain.length === 0 && searchgoGrab) {
        Toast.info('请选择备选车次', 2, null, false)
        return
      }
      if (haveChooseZuo && haveChooseZuo.length === 0 && searchgoGrab) {
        Toast.info('请选择备选坐席', 2, null, false)
        return
      }
      if (chooseTrain && chooseTrain.length > 0 && haveChooseZuo && haveChooseZuo.length === 0) {
        Toast.info('请选择备选坐席', 2, null, false)
        return
      }
      setStore('huoche_packagePrice', choosePrice, 'session')
      const seatsDataGrab = getStore('huoche_seatsData_grab', 'session')
      const details = getStore('huoche_details', 'session')
      const haveChooseZuomaxprice = getStore('huoche_haveChooseZuo', 'session')
      if (seatsDataGrab && seatsDataGrab.price && haveChooseZuomaxprice && haveChooseZuomaxprice.length === 0) {
        setStore('huoche_maxprice', seatsDataGrab.price, 'session')
      }
      if (chooseTrain && chooseTrain.length === 0 && details) {
        setStore('huoche_startTime', details, 'session')
        setStore('huoche_maxpriceObj', seatsDataGrab, 'session')
      }
      // 2017-12-14
      // removeStore('huoche_phone', 'session')
      // removeStore('huoche_name', 'session')
      const customerUserId = getStore('customerUserId', 'session')
      if (customerUserId) {
        browserHistory.push('/huoche/ordergrab')
      } else {
        login(err => {
          if (err) {
            console.log(err)
            Toast.info('登录失败，请退出重新登录', 2, null, false)
          } else {
            console.log('我是用户绑定')
            browserHistory.push('/huoche/ordergrab')
          }
        }, true)
      }
    },
    // 处理时间
    handleTimeStart: (alterTime, chooseArrtime) => {
      dispatch({ type: 'TIME_CHOOSE_ARR', chooseArrtime, alterTime })
      console.log('props.propsObj', alterTime, chooseArrtime)
    },
    // 处理套餐
    handleSpeedName: (chooseSpeedname, choosePrice) => {
      console.log('test--chooseSpeedname, choosePrice', chooseSpeedname, choosePrice)
      setStore('huoche_packagePrice', choosePrice, 'session')
      dispatch({
        type: 'SPEED_DATA',
        chooseSpeedname,
        choosePrice,
      })
    },
    // 接收最大价格参数
    handleMaxPrice: (price, maxpriceObj, haveChooseZuo) => {
      console.log('test--最大价格', price, maxpriceObj)
      dispatch({
        type:     'MAX_PRICE',
        maxprice: price,
        maxpriceObj,
        haveChooseZuo,
      })
      if (price > 50) {
        const text = '闪电抢票（¥50/份）'
        setStore('huoche_packagePrice', 50, 'session')
        setStore('huoche_chooseSpeedname', text, 'session')
        dispatch({ type: 'SPEED_DATA', choosePrice: 50, chooseSpeedname: text })
      } else {
        const text = '闪电抢票（¥30/份）'
        setStore('huoche_packagePrice', 30, 'session')
        setStore('huoche_chooseSpeedname', text, 'session')
        dispatch({ type: 'SPEED_DATA', choosePrice: 30, chooseSpeedname: text })
      }
    },
    // 接收备选日期
    // handleChooseArr
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    const chooseTime = getStore('huoche_ChooseTime', 'session')
    const timearr = getDateArr(chooseTime)
    const chooseCity = getStore('huoche_ChooseCity', 'session')
    const detailsTrick = getStore('huoche_details', 'session')
    const endDate = getStore('huoche_endDate', 'session')
    let maxprice = getStore('huoche_maxprice', 'session')
    const chooseSeat = getStore('huoche_chooseSeat', 'session')
    const haveChooseZuo = getStore('huoche_haveChooseZuo', 'session')
    const packagePrice = getStore('huoche_packagePrice', 'session')
    let chooseSpeedname = getStore('huoche_chooseSpeedname', 'session')
    const seatsDataGrab = getStore('huoche_seatsData_grab', 'session')
    const chooseTrain = getStore('huoche_chooseTrain', 'session')
    const chooseArrtime = getStore('huoche_chooseArrtime', 'session')
    const alterTime = getStore('huoche_alterTime', 'session')
    const channel = getStore('huoche_channel', 'session')
    let choosePrice = 0
    const searchgoGrab = location.search
    if (packagePrice) {
      choosePrice = packagePrice
    } else if (maxprice && maxprice > 50) {
      choosePrice = 50
      chooseSpeedname = '闪电抢票（¥50/份）'
    } else if (detailsTrick && detailsTrick.price && detailsTrick.price > 50) {
      choosePrice = 50
      chooseSpeedname = '闪电抢票（¥50/份）'
      maxprice = detailsTrick.price
    } else if (detailsTrick && detailsTrick.price && detailsTrick.price < 50) {
      choosePrice = 30
      chooseSpeedname = '闪电抢票（¥30/份）'
      maxprice = detailsTrick.price
    } else if ((haveChooseZuo && haveChooseZuo.length === 0)) {
      choosePrice = 0
      chooseSpeedname = '请选择抢票套餐'
    } else {
      choosePrice = 30
      chooseSpeedname = '闪电抢票（¥30/份）'
    }
    dispatch({ type: 'SPEED_DATA', choosePrice, chooseSpeedname })
    dispatch({ type: 'CHOOSE_CITY', chooseCity, detailsTrick, endDate, searchgoGrab, channel })
    setStore('huoche_timearr', timearr, 'session')
    dispatch({ type: 'TIME_CHOOSE_ARR', timearr, chooseArrtime, alterTime })
    dispatch({ type: 'CALENDAR_TIME', chooseTime })
    dispatch({ type: 'MAX_PRICE', maxprice, haveChooseZuo })
    dispatch({ type: 'HAVE_CHOOSE_TRAIN', chooseSeat, seatsDataGrab, chooseTrain })
    if (chooseTrain && chooseTrain.length === 0 && searchgoGrab) {
      Toast.info('请选择备选车次', 2, null, true)
    }
  },
  componentDidMount: () => {
    console.log('root mounted', dispatch)
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
  wrap(mapFunToComponent)(Grabticket)
)
