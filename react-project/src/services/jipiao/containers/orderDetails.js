// import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
// import { get, send, setStore, getStore } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { afterOrdering, login } from 'business'
import { odlReset } from '../actions/orderDetails.js'
import OrderDetails from '../components/orderDetails'

const mapStateToProps = ({ orderDetails }) => ({ ...orderDetails, login })

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    goPay: orderNo => {
      afterOrdering({ id: orderNo })
    },

    goRefundup: (orderNo, ticketNo) => {
      browserHistory.push(`/jipiao/refundup/${ orderNo }/${ ticketNo }`)
    },

    goChangeup: (orderNo, ticketNo) => {
      browserHistory.push(`/jipiao/changeup/${ orderNo }/${ ticketNo }`)
    },

    goChangeord: (orderNo, ticketNo) => {
      browserHistory.push(`/jipiao/changeord/${ orderNo }/${ ticketNo }`)
    },

    goChange: (orderNo, ticketNo, changeid, isUnpaid) => {
      if (isUnpaid) {
        Toast.info('您还有改签订单未支付')
      } else {
        browserHistory.push(`/jipiao/change/${ orderNo }/${ changeid }/${ ticketNo }`)
      }
    },

    goRefund: (orderNo, ticketNo) => {
      browserHistory.push(`/jipiao/refund/${ orderNo }/${ ticketNo }`)
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    // 登录
    login(err => {
      if (err) {
        console.log('登录失败')
      }
    })
    const { routeParams } = state
    const { orderNo } = routeParams
    dispatch(odlReset({
      orderNo,
    }))
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(OrderDetails)
)
