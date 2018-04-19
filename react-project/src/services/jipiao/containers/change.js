import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { getStore, setStore } from '@boluome/common-lib'
import { wrap, Mask, SlidePage, Loading }    from '@boluome/oto_saas_web_app_component'
import { get, send, afterOrdering } from 'business'
import { cheReset } from '../actions/change.js'
import Change, { Changeinfo } from '../components/change'
import Changeair from '../components/changeair'
import { Tuigaiqian } from '../components/detail'

const mapStateToProps = ({ change }) => ({ ...change })

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    // handleChangefiles: files => {
    //   console.log(files)
    //   dispatch(cheReset({
    //     files,
    //   }))
    // },

    handleChangeflight: nextflightData => {
      dispatch(cheReset({
        nextflightData,
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

    handleTime: (date, timeClose, handleChangeflight) => {
      const datesplit = date.split('-')
      const nextdate = new Date()
      nextdate.setFullYear(datesplit[0], (datesplit[1] * 1) - 1, datesplit[2])
      const datestr = nextdate.toLocaleDateString()
      setStore('changeDate', datestr.replace(/\//g, '-'), 'session')
      Mask(
        <SlidePage target='right' showClose={ false } >
          <Changeair timeClose={ timeClose } handleChangeflight={ handleChangeflight } />
        </SlidePage>,
        { mask: false, style: { position: 'absolute' } }
      )
    },

    handleChoose(i, passengers) {
      passengers[i].choose = !passengers[i].choose
      dispatch(cheReset({
        passengers,
      }))
    },

    handlerefundCauseId: refundCauseId => {
      setStore('changeCode', refundCauseId[0], 'session')
      dispatch(cheReset({
        refundCauseId,
        nextflightData: '',
      }))
    },

    handleSubmit: (passengers, nextflightData, changeArr) => {
      const sub = (credentialCodes, datas, changetextArr) => {
        const closeLoading = Loading()
        const { uniqKey } = datas
        let index = 0
        for (let i = 0; i < changetextArr.length; i++) {
          if (changetextArr[i].value === getStore('changeCode', 'session')) {
            index = i
          }
        }
        const imgs = []
        // const abc = getStore('changeCode', 'session') || 0
        // if (abc * 1 === 3) {
        //   imgs = imgfiles.reduce((arr, e) => {
        //     arr.push(e.url)
        //     return arr
        //   }, [])
        // }
        send('/jipiao/v1/change/apply', {
          channel:      getStore('channel', 'session'),
          code:         getStore('changeCode', 'session'),
          orderNo:      getStore('changeOrderNo', 'session'),
          changeDate:   getStore('changeDate', 'session'),
          applyRemarks: changetextArr[index].label,
          credentialCodes,
          uniqKey,
          imgs,
        })
        .then(({ code, data, message }) => {
          console.log(data)
          const { routeParams } = props
          const { orderNo } = routeParams
          closeLoading()
          if (code === 0) {
            const { isNeedPay } = data
            if (isNeedPay) {
              afterOrdering({ id: orderNo, subId: data.endorseOrderId, orderType: 'jipiao' })
            } else {
              browserHistory.push(`/jipiao/orderDetails/${ orderNo }`)
            }
          } else if (code === 3000) {
            browserHistory.push(`/jipiao/orderDetails/${ orderNo }`)
          } else {
            Toast.info(message, 1)
          }
        })
      }
      const creCodes = passengers.reduce((arr, e) => {
        if (e.choose) { arr.push(e.credentialCode) }
        return arr
      }, [])
      if (nextflightData && (creCodes.length > 0)) {
        // if (((getStore('changeCode', 'session') * 1) === 3) && (files.length === 0)) {
        //   Toast.info('非自愿退票需上传证明资料', 3)
        //   return false
        // }
        Mask(
          <Changeinfo data={ nextflightData } credentialCodes={ creCodes } changeArr={ changeArr } sub={ sub } />,
          { mask: false, maskStyle: { display: 'none' }, style: { position: 'absolute' }, maskClosable: false }
        )
      } else if (creCodes.length > 0) {
        Toast.info('请选择改签航班', 1)
      } else {
        Toast.info('请选择改签乘客', 1)
      }
    },
  }
}

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    setStore('channel', 'qunar', 'session')
    setStore('changeCode', 1, 'session')
    const { routeParams } = state
    const { orderNo, orderId, ticketNo } = routeParams
    get(`/order/v1/jipiao/${ orderNo }/info`)
    .then(({ code, data, message }) => {
      if (code === 0) {
        let flights = ''
        if (orderNo === orderId) {
          flights = data.flights[0]
        } else {
          const fs = data.endorseList.filter(e => {
            if (e.orderId === orderId) {
              return true
            }
            return false
          })
          flights = fs[0].flights[0]
        }
        const passL = data.passengers.filter(e => {
          if (e.ticketNo && e.ticketNo === ticketNo && e.isChange) {
            return true
          }
          return false
        })
        setStore('changeOrderNo', data.partnerOrderNo, 'session')
        dispatch(cheReset({
          passengers:     passL.length > 1 ? passL.map(e => ({ ...e, choose: false })) : passL.map(e => ({ ...e, choose: true })),
          preflightData:  flights,
          showflightData: flights,
          changeRule:     data.changeRule,
        }))
      } else {
        console.log(message)
      }
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Change)
)
