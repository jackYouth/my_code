// import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { Modal } from 'antd-mobile'
import { send } from '@boluome/common-lib'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { afterOrdering } from 'business'
import { odlReset } from '../actions/orderDetails.js'
import OrderDetails from '../components/orderDetails'

const alert = Modal.alert
const showAlert = f => {
  alert('', '目前仅支持全部车票退票，请确认', [
    {
      text:    '我意已决',
      onPress: () => {
        f()
      },
    },
    {
      text:    '考虑以下',
      onPress: () => {
        console.log('0.0')
      },
    },
  ])
}

const mapStateToProps = ({ orderDetails }) => ({ ...orderDetails })

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    handleBool: bool => {
      dispatch(odlReset({
        bool,
      }))
    },

    handleTui: (id, partnerId) => {
      showAlert(() => {
        send('/qiche/v1/refund/apply', {
          channel: 'tongcheng',
          id,
          partnerId,
        })
        .then(({ code, data, message }) => {
          if (code === 0) {
            console.log(data)
          } else {
            console.log(message)
          }
        })
      })
    },

    goPay: orderNo => {
      afterOrdering({ id: orderNo })
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
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
