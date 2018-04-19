import { connect } from 'react-redux'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { Toast, Modal } from 'antd-mobile'
import { browserHistory } from 'react-router'
import { send, afterOrdering } from 'business'
import { derReset } from '../actions/order.js'
import Order from '../components/order'

const alert = Modal.alert

const mapStateToProps = state => {
  const { order } = state
  return {
    ...order,
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    handleGoaddrMap: () => {
      const cinemaInfo = getStore('cinemaInfo', 'session')
      dispatch({ type: 'ADDR_INIT' })
      browserHistory.push(`/dianying/addr/${ cinemaInfo.name }/${ cinemaInfo.address }/${ cinemaInfo.longitude }/${ cinemaInfo.latitude }`)
    },

    handleCur: curDiscountObj => {
      dispatch(
        derReset({
          curDiscountData: curDiscountObj,
        })
      )
    },

    handleTip: tip => {
      dispatch(
        derReset({
          tip: !tip,
        })
      )
    },

    handleChangephone: phone => {
      dispatch(
        derReset({
          phone,
        })
      )
    },

    handleOrder: (filmInfo, phone, plan, cinemaId, seatNo, curDiscountData) => {
      const customerUserId = getStore('customerUserId', 'session')
      const userPhone = getStore('userPhone', 'session')
      const { routeParams } = props
      const { channel } = routeParams
      const seat = seatNo.map(v => `${ v.id }`)
      const reg = /^1\d{10}$/
      if (!userPhone) {
        Toast.info('未登录', 1)
      } else if (!(reg.test(phone))) {
        Toast.info('请输入正确手机号', 1)
      } else {
        const handleClose = Loading()
        const activityId =  curDiscountData.activities ? curDiscountData.activities.id : ''
        const couponId =  curDiscountData.coupon ? curDiscountData.coupon.id : ''
        send('/dianying/v2/order', { channel, filmId: filmInfo.id, cinemaId, planId: plan.planId, seatNo: seat, count: seat.length, moviePhoto: filmInfo.pic, customerUserId, userPhone, phone, activityId, couponId }).then(({ code, data, message }) => {
          if (code === 0) {
            handleClose()
            afterOrdering(data)
          } else {
            handleClose()
            console.log(message)
            const msg = '您选择的座位已被抢，赶紧再另外选个座位下单吧'
            const showAlert = info => {
              alert('', info, [
                {
                  text:    '我知道了',
                  onPress: () => {
                    console.log(123)
                  },
                },
              ])
            }
            showAlert(message || msg)
          }
        })
      }
    },
  }
}

const mapFunToComponent  = (dispatch, state) => {
  return {
    componentWillMount: () => {
      document.title = '订单确认'
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { customize = {} } = customer
      if (customize.default.type === 'banner')  document.getElementById('root').firstChild.firstChild.firstChild.lastChild.innerHTML = '订单确认'
      const { routeParams } = state
      const { channel } = routeParams
      const cinemaInfo = getStore('cinemaInfo', 'session')
      const plan = getStore('plan', 'session')
      const filmInfo = getStore('filmInfo', 'session')
      const filmDate = getStore('filmDate', 'session').slice(0, -1).replace('月', '-')
      // console.log(getStore('filmDate', 'session'))
      const seatNo = JSON.parse(getStore('seatNo', 'session'))
      dispatch(
        derReset({
          channel,
          plan,
          seatNo,
          filmDate,
          filmInfo,
          cinemaInfo,
          cinemaId: cinemaInfo.id,
          phone:    getStore('userPhone', 'session') || '',
        })
      )
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Order)
  )
