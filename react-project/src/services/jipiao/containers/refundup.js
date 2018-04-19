import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { getStore } from '@boluome/common-lib'
import { wrap, Mask, Loading, SlidePage }    from '@boluome/oto_saas_web_app_component'
import { get, send } from 'business'
// import { afterOrdering } from 'business'
import { repReset } from '../actions/refundup.js'
import Changeup from '../components/refundup'
import { Tuigaiqian } from '../components/detail'

const mapStateToProps = ({ refundup }) => ({ ...refundup })

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    handleChangefiles: files => {
      console.log(files)
      dispatch(repReset({
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

    handleSubmit: (passengers, files) => {
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
          browserHistory.push(`/jipiao/orderDetails/${ orderNo }`)
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
        const passL = data.passengers.filter(e => {
          if (e.ticketNo && e.ticketNo === ticketNo) {
            return true
          }
          return false
        })
        dispatch(repReset({
          passengers: passL.map(e => ({ ...e, choose: false })),
          changeRule: data.changeRule,
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
  wrap(mapFunToComponent)(Changeup)
)
