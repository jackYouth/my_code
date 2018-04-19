import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { wrap, Mask, SlidePage }    from '@boluome/oto_saas_web_app_component'
import { get, afterOrdering } from 'business'
import { chdReset } from '../actions/changeord.js'
import Changeord from '../components/changeord'
import { Tuigaiqian } from '../components/detail'

const mapStateToProps = ({ changeord }) => ({ ...changeord })

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    handleTuigai: data => {
      Mask(
        <SlidePage target='right' showClose={ false } >
          <Tuigaiqian data={ data } />
        </SlidePage>,
        { mask: false, style: { position: 'absolute' } }
      )
    },

    handleSubmit: endorseOrderId => {
      const { routeParams } = props
      const { orderNo } = routeParams
      afterOrdering({ id: orderNo, subId: endorseOrderId, orderType: 'jipiao' })
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    const { routeParams } = state
    const { orderNo, ticketNo } = routeParams
    get(`/order/v1/jipiao/${ orderNo }/info`)
    .then(({ code, data, message }) => {
      if (code === 0) {
        const preflightData = data.flights[0]
        const nextflightData = data.unpaidFlights[0]
        const passL = data.passengers.filter(e => {
          if (e.ticketNo && e.ticketNo === ticketNo) {
            return true
          }
          return false
        })
        dispatch(chdReset({
          passengers: passL.map(e => ({ ...e, choose: false })),
          changeRule: data.changeRule,
          preflightData,
          nextflightData,
        }))
      } else {
        console.log(message)
        Toast.info(message, 3)
      }
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Changeord)
)
