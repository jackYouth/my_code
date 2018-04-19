// import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
// import { Toast } from 'antd-mobile'
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
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    const { routeParams } = state
    const { orderNo } = routeParams
    console.log(123456)
    dispatch(odlReset({
      orderNo,
    }))
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(OrderDetails)
)
