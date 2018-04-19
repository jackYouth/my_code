// import React from 'react'
import { connect } from 'react-redux'
// import { browserHistory } from 'react-router'
import { send, getStore } from '@boluome/common-lib'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { afterOrdering } from 'business'
import { ordReset } from '../actions/order.js'
import Order from '../components/order'

const mapStateToProps = ({ order }) => ({ ...order })

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    handleContactor: itemdata => {
      dispatch(ordReset({
        contactorName: itemdata.name,
        contactorId:   itemdata.id,
      }))
    },

    handleCur: curDiscountObj => {
      dispatch(
        ordReset({
          curDiscountData: curDiscountObj,
        })
      )
    },

    handleChangePhone: contactorPhone => {
      console.log(contactorPhone)
      dispatch(ordReset({
        contactorPhone,
      }))
    },

    handleBool: bool => {
      dispatch(ordReset({
        bool,
      }))
    },

    handlePasdata: (pasdata, pasdataitem, sign, contactorId) => {
      console.log(pasdata, pasdataitem, sign, contactorId)
      if (pasdataitem.length && sign) {
        const checiinfo = getStore('checiinfo', 'session')
        if (pasdataitem.length > checiinfo.maxTicketCount) {
          Toast.info(`每单最大乘客数为${ checiinfo.maxTicketCount }位`)
          return false
        }
        const arr = pasdataitem.filter(e => e.id === contactorId)
        if (arr.length > 0) {
          dispatch(ordReset({
            pasdata: pasdataitem,
          }))
        } else {
          dispatch(ordReset({
            contactorName: pasdataitem[0].name,
            contactorId:   pasdataitem[0].id,
            pasdata:       pasdataitem,
          }))
        }
      } else if (!sign) {
        let index = ''
        const ar = pasdata.filter((e, i) => {
          if (pasdataitem.id === e.id) {
            index = i
            return true
          }
          return false
        })
        if (ar.length) pasdata.splice(index, 1)
        if (ar[0].id === contactorId && pasdata.length) {
          dispatch(ordReset({
            contactorName: pasdata[0].name,
            contactorId:   pasdata[0].id,
            pasdata,
          }))
        } else if (ar[0].id === contactorId) {
          dispatch(ordReset({
            contactorName: '',
            contactorId:   '',
            pasdata,
          }))
        } else {
          dispatch(ordReset({
            pasdata,
          }))
        }
      }
    },

    handleSubmit: order => {
      const { contactorId, contactorPhone, pasdata, checiinfo, bool, jisu, baoxianData } = order
      const { depatureCity, arriveCity, departureDate, scheduleNo } = checiinfo
      const reg = /^1[34578]\d{9}$/
      if (pasdata.length === 0) {
        Toast.info('未添加乘客', 1)
      } else if (!(reg.test(contactorPhone))) {
        Toast.info('请输入正确手机号', 1)
      } else {
        const handleClose = Loading()
        const arr = pasdata.filter(e => e.id === contactorId)
        const contactor = {
          name:           arr[0].name,
          phone:          contactorPhone,
          credentialCode: arr[0].idCard,
        }
        const passengers = pasdata.map(e => e.id)
        const extraServices = []
        if (bool) extraServices.push({ type: jisu.type })
        const arl = baoxianData.filter(e => e.choose)
        if (arl.length) extraServices.push({ type: 1, productId: arl[0].productId })
        // 提交订单
        send('/qiche/v1/order', {
          channel:        getStore('channel', 'session'),
          customerUserId: getStore('customerUserId', 'session'),
          departureCity:  depatureCity,
          arriveCity,
          departureDate,
          scheduleNo,
          passengers,
          extraServices,
          contactor,
        })
        .then(({ code, data, message }) => {
          handleClose()
          if (code === 0) {
            console.log(data)
            afterOrdering(data)
          } else {
            Toast.info(message, 1)
            console.log(message)
          }
        })
      }
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    const checiinfo = getStore('checiinfo', 'session')
    console.log(checiinfo)
    const { depatureCity, arriveCity, departureStation, arriveStation, departureDate, departureTime, ticketPrice, scheduleNo } = checiinfo
    const pricing = passengersCount => {
      // 核价
      send('/qiche/v1/pricing', {
        channel:       getStore('channel', 'session'),
        departureCity: depatureCity,
        arriveCity,
        departureStation,
        arriveStation,
        departureDate,
        departureTime,
        ticketPrice,
        scheduleNo,
        passengersCount,
      })
      .then(({ code, data, message }) => {
        if (code === 0) {
          dispatch(ordReset({
            servicePrice: data.servicePrice,
          }))
        } else {
          console.log(message)
        }
      })
    }
    pricing(1)
    // 查询保险
    send('/qiche/v1/extra/service/info', {
      channel:           getStore('channel', 'session'),
      departureCity:     depatureCity,
      arriveCity,
      departureStation,
      arriveStation,
      departureDateTime: `${ departureDate } ${ departureTime }`,
      ticketPrice,
    })
    .then(({ code, data, message }) => {
      if (code === 0) {
        const jisu = data.filter(e => e.type === 3)[0]
        const baoxianData = data.filter(e => e.type === 1)[0]
        const bxArr = baoxianData ? baoxianData.list.map(e => {
          if (e.compensationVolume) return { ...e, choose: false }
          return { ...e, choose: true }
        }) : []
        dispatch(ordReset({
          jisu,
          baoxianData: bxArr,
          checiinfo,
        }))
        console.log(data)
      } else {
        dispatch(ordReset({
          checiinfo,
        }))
        console.log(message)
      }
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Order)
)
