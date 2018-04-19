import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { login } from 'business'
import { Toast  } from 'antd-mobile'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { getStore, setStore, removeStore } from '@boluome/common-lib'
import Details         from '../components/details'
import { seatsDataFn } from '../actions/details'
import { removeStoreFn } from '../actions/order'

const mapStateToProps = state => {
  console.log(state)
  const { details } = state
  return {
    ...details,
  }
}

const mapDispatchToProps = dispatch => {
  const gobrowserOrder = ChangeSign => {
    if (ChangeSign && ChangeSign.indexOf('ChangeSign') > 0) {
      browserHistory.push('/huoche/ChangeSign')
    } else {
      browserHistory.push('/huoche/order')
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
    handleCalendarDate: date => {
      console.log('handleCalendarDate----', date)
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
    goOrderFn: (item, ChangeSign) => {
      setStore('huoche_seats', item, 'session')
      const customerUserId = getStore('customerUserId', 'session')
      // 用户绑定
      if (customerUserId) {
        gobrowserOrder(ChangeSign)
      } else {
        login(err => {
          if (err) {
            console.log(err)
            Toast.info('登录失败，请退出重新登录', 2, null, false)
          } else {
            console.log('我是用户绑定')
            gobrowserOrder(ChangeSign)
          }
        }, true)
      }
    },
    // 到抢票页面
    goGrabticket: (ticketDetails, seatsData) => {
      console.log('ticketDetails-goGrabticket-', ticketDetails, seatsData)
      removeStore('huoche_maxpriceObj', 'session')
      setStore('huoche_seatsData_grab', seatsData, 'session')
      // setStore('TOURISTNUMBER', [], 'session')
      removeStoreFn()
      browserHistory.push('/huoche/grabticket')
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    const search = location.search
    console.log('search--', search)
    dispatch({ type: 'CHANGE_URL', ChangeSign: search })
    const ticketDetails = getStore('huoche_details', 'session')
    dispatch({ type: 'TICKETDETAILS', ticketDetails })
    if (ticketDetails) {
      dispatch({ type: 'KJIN_SEATSDATA', seatsData: ticketDetails.seats })
    }
    const chooseTime = getStore('huoche_ChooseTime', 'session')
    dispatch({ type: 'CALENDAR_TIME', chooseTime })
    // 这里是清空订单页面的部分数据----再让改就是傻缺吧
    // removeStore('TOURISTNUMBER', 'session')
    // removeStore('huoche_phone', 'session')
    // removeStore('huoche_name', 'session')
  },
  componentDidMount: () => {
    console.log('root mounted', dispatch)
  },
  componentWillUnmount: () => {
    dispatch({ type: 'KJIN_SEATSDATA', noSeats: true })
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Details)
)
