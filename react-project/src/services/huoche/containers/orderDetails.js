import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'
import { login } from 'business'
import orderDetails         from '../components/orderDetails'
// import { seatsDataFn } from '../actions/details'

const mapStateToProps = state => {
  console.log('--test-orderDetailsorderDetailsorderDetails-', state.orderDetails)
  return {
    ...state.orderDetails,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    goListFn: () => {
      browserHistory.push('/huoche/list')
    },
    goOrderFn: item => {
      setStore('huoche_seats', item, 'session')
      browserHistory.push('/huoche/order')
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    if (!getStore('customerUserId', 'session')) {
      login(err => {
        if (err) {
          console.log('登录失败')
        } else {
          console.log('登录成功')
        }
      }, true)
    }
    // 以下待清除
    const ticketDetails = getStore('huoche_details', 'session')
    dispatch({ type: 'TICKETDETAILS', ticketDetails })
    if (ticketDetails) {
      dispatch({ type: 'KJIN_SEATSDATA', seatsData: ticketDetails.seats })
    }
    // 购买的座位信息
    const seatsChoose = getStore('huoche_seats', 'session')
    dispatch({ type: 'SEATSCHOOSE', seatsChoose })
    const chooseTime = getStore('huoche_ChooseTime', 'session')
    dispatch({ type: 'CALENDAR_TIME', chooseTime })
    const touristNumer = getStore('TOURISTNUMBER', 'session')
    if (touristNumer) {
      dispatch({ type: 'TOURISTNUMBER', touristNumer })
    } else {
      setStore('TOURISTNUMBER', [], 'session')
    }
    // 清空残留的人员信息
    setStore('huoche_passengersChoose', '', 'session')
    setStore('huoche_ChooseCredentialarr', '', 'session')
  },
  componentDidMount: () => console.log('root mounted', dispatch),
  componentWillUnmount: () => {
    const node = document.getElementsByClassName('mask-container')
    if (node.length > 0) {
      node[0].remove()
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(orderDetails)
)
