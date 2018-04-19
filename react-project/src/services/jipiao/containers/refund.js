import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { getStore, setStore } from '@boluome/common-lib'
import { wrap, Mask, Loading, SlidePage }    from '@boluome/oto_saas_web_app_component'
import { get, send } from 'business'
import { refReset, getrefundCause } from '../actions/refund.js'
import Refund, { Refundinfo } from '../components/refund'
import { Tuigaiqian } from '../components/detail'

const mapStateToProps = ({ refund }) => ({ ...refund })

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    handleChangefiles: files => {
      dispatch(refReset({
        files,
      }))
    },

    handleChoose: (i, passengers) => {
      passengers[i].choose = !passengers[i].choose
      dispatch(refReset({
        passengers,
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

    handlerefundCauseId: (refundCauseId, credentialCodes) => {
      dispatch(getrefundCause(refundCauseId, credentialCodes))
    },

    handleRefund: (passengers, refundArr, files, isVoluntary, orderNo) => {
      const credentialCodes = passengers.reduce((arr, e) => {
        if (e.choose) { arr.push(e.credentialCode) }
        return arr
      }, [])
      if (credentialCodes.length > 0) {
        if (!isVoluntary && files.length === 0) {
          Toast.info('非自愿退票需上传证明资料', 3)
          return false
        }
        const closeLoading = Loading()
        send('/jipiao/v1/refund/info', {
          channel: getStore('channel', 'session'),
          code:    getStore('refundCauseId', 'session'),
          credentialCodes,
          orderNo: getStore('refundOrderNo', 'session'),
        })
        .then(({ code, data, message }) => {
          closeLoading()
          if (code === 0) {
            console.log(data)
            Mask(
              <Refundinfo datas={ data } passengers={ passengers } refundArr={ refundArr } files={ files } orderNo={ orderNo } />,
              { mask: false, maskStyle: { display: 'none' }, style: { position: 'absolute' }, maskClosable: false }
            )
          } else {
            console.log(message)
            Toast.info(message, 3)
          }
        })
      } else {
        Toast.info('请选择退票乘客', 1)
      }
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    setStore('channel', 'qunar', 'session')
    setStore('refundCauseId', 16, 'session')
    const { routeParams } = state
    const { orderNo, ticketNo } = routeParams
    get(`/order/v1/jipiao/${ orderNo }/info`)
    .then(({ code, data, message }) => {
      if (code === 0) {
        const passL = data.passengers.filter(e => {
          if (e.ticketNo && e.ticketNo === ticketNo && e.isRefund) {
            return true
          }
          return false
        })

        const credentialCodes = passL.reduce((arr, e) => {
          arr.push(e.credentialCode)
          return arr
        }, [])
        setStore('refundOrderNo', data.partnerOrderNo, 'session')
        dispatch(refReset({
          passengers: passL.length > 1 ? passL.map(e => ({ ...e, choose: false })) : passL.map(e => ({ ...e, choose: true })),
          changeRule: data.changeRule,
          credentialCodes,
          orderNo,
        }))
        console.log(state)
        dispatch(getrefundCause(state.refundCauseId, credentialCodes))
      } else {
        console.log(message)
        Toast.info(message, 3)
      }
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Refund)
)
