import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { getStore } from '@boluome/common-lib'
import { wrap, Mask, Loading, SlidePage }    from '@boluome/oto_saas_web_app_component'
import { get, send, afterOrdering } from 'business'
import { chuReset } from '../actions/changeup.js'
import Changeup from '../components/changeup'
import { Tuigaiqian } from '../components/detail'

const mapStateToProps = ({ changeup }) => ({ ...changeup })

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    handleChangefiles: files => {
      console.log(files)
      dispatch(chuReset({
        files,
      }))
    },

    handleTuigai: data => {
      Mask(
        <SlidePage target='right' showClose={ false } >
          <Tuigaiqian data={ data } />
        </SlidePage>,
        { mask: false, style: { position: 'absolute' } }
      )
    },

    handleSubmit: (passengers, files, endorseOrderId) => {
      const { routeParams } = props
      const { orderNo, ticketNo } = routeParams
      const closeLoading = Loading()
      const credentialCodes = passengers.reduce((arr, e) => {
        arr.push(e.credentialCode)
        return arr
      }, [])
      const imgs = files.reduce((arr, e) => {
        arr.push(e.url)
        return arr
      }, [])
      send('/jipiao/v1/upload', {
        id:      orderNo,
        orderNo: ticketNo,
        channel: getStore('channel', 'session'),
        credentialCodes,
        imgs,
      })
      .then(({ code, data, message }) => {
        closeLoading()
        if (code === 0) {
          console.log(data)
          afterOrdering({ id: orderNo, subId: endorseOrderId, orderType: 'jipiao' })
        } else {
          Toast.info(message, 1)
        }
      })
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
        dispatch(chuReset({
          passengers: passL.map(e => ({ ...e, choose: false })),
          changeRule: data.changeRule,
          preflightData,
          nextflightData,
        }))
      } else {
        console.log(message)
      }
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Changeup)
)
