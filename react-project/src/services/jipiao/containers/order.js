// import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { getStore } from '@boluome/common-lib'
import { wrap, Loading }    from '@boluome/oto_saas_web_app_component'
import { Toast, Modal } from 'antd-mobile'
import { get, send, afterOrdering } from 'business'
import { ordReset } from '../actions/order.js'
import Order from '../components/order'

const alert = Modal.alert
let timeOut = ''
const showAlert = () => {
  alert('温馨提示', '暂不支持儿童/婴儿票', [
    {
      text:    '确定',
      onPress: () => {
        console.log('儿童票')
      },
    },
  ])
}

const mapStateToProps = ({ order }) => ({ ...order })

const mapDispatchToProps = (dispatch, props) => {
  return {
    dispatch,

    handleChangepasdata: (pasdata, pasdataitem, insuranceList) => {
      let bool = false
      let index = ''
      for (let i = 0; i < pasdata.length; i++) {
        if (pasdataitem.id === pasdata[i].id) {
          bool = true
          index = i
        }
      }
      if (bool) {
        for (let i = 0; i < insuranceList.length; i++) {
          let bools = false
          let indexs = ''
          for (let j = 0; j < insuranceList[i].credentialCodes.length; j++) {
            if (pasdataitem.id === insuranceList[i].credentialCodes[j].id) {
              bools = true
              indexs = j
            }
          }
          if (bools && pasdataitem.type === 1) {
            insuranceList[i].credentialCodes[indexs] = pasdataitem
          } else if (bools) {
            insuranceList[i].credentialCodes.splice(indexs, 1)
          }
        }
        if (pasdataitem.type === 1) {
          pasdata[index] = pasdataitem
        } else {
          pasdata.splice(index, 1)
          showAlert()
        }
      }

      dispatch(ordReset({
        pasdata,
        insuranceList,
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

    handleChangeName: contactorName => {
      dispatch(ordReset({
        contactorName,
      }))
    },

    handleContactData: contactData => {
      if (!contactData) {
        contactData = ''
      }
      dispatch(ordReset({
        contactData,
      }))
    },

    handleInvoiceData: invoiceData => {
      if (!invoiceData) {
        invoiceData = ''
      }
      dispatch(ordReset({
        invoiceData,
      }))
    },

    handleBool: bool => {
      dispatch(ordReset({
        bool,
      }))
    },

    handleInseran: insuranceList => {
      dispatch(ordReset({
        insuranceList,
      }))
    },

    handlePasdata: (pasdata, pasdataitem, sign, insuranceList) => {
      if (pasdataitem && sign) {
        dispatch(ordReset({
          pasdata: pasdataitem,
        }))
      } else if (!sign) {
        let bool = false
        let index = ''
        for (let i = 0; i < pasdata.length; i++) {
          if (pasdataitem.id === pasdata[i].id) {
            bool = true
            index = i
          }
        }
        if (bool) {
          pasdata.splice(index, 1)
        }
        if (insuranceList) {
          for (let i = 0; i < insuranceList.length; i++) {
            let bools = false
            let indexs = ''
            for (let j = 0; j < insuranceList[i].credentialCodes.length; j++) {
              if (pasdataitem.id === insuranceList[i].credentialCodes[j].id) {
                bools = true
                indexs = j
              }
            }
            if (bools) {
              insuranceList[i].credentialCodes.splice(indexs, 1)
            }
          }
          dispatch(ordReset({
            insuranceList,
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
      const { routeParams } = props
      const { index, flightTypeFullName } = routeParams
      const { pricingData, curDiscountData, flightData, pasdata = [], bool, insuranceList = [], invoiceData, contactData, contactorName, contactorPhone } = order
      const { bkParams } = flightData.priceList[index]
      const { airlineName, departure, arrive, departureTime, arriveTime, flightNum } = flightData
      const reg = /^1[34578]\d{9}$/
      const contactor = {
        name:  contactorName,
        phone: contactorPhone,
      }
      const identityIds = pasdata.reduce((arr, e) => {
        arr.push(e.id)
        return arr
      }, [])
      const temp =  JSON.parse(JSON.stringify(insuranceList))
      for (let i = 0; i < temp.length; i++) {
        for (let j = 0; j < temp[i].credentialCodes.length; j++) {
          temp[i].credentialCodes[j] = temp[i].credentialCodes[j].id
        }
      }
      const invoice = {}
      if (bool) {
        invoice.rv = 1
        invoice.invoiceId = invoiceData ? invoiceData.id : ''
        invoice.contactId = contactData ? contactData.contactId : ''
      } else {
        invoice.rv = 0
      }
      const activityId =  curDiscountData.activities ? curDiscountData.activities.id : ''
      const couponId =  curDiscountData.coupon ? curDiscountData.coupon.id : ''
      if (identityIds.length === 0) {
        Toast.info('未添加乘客', 1)
      } else if (contactorName.length === 0) {
        Toast.info('未填写联系人姓名', 1)
      } else if (!(reg.test(contactorPhone))) {
        Toast.info('请输入正确手机号', 1)
      } else if (bool && !invoice.invoiceId) {
        Toast.info('未填写发票信息', 1)
      } else if (bool && !invoice.contactId) {
        Toast.info('未填写收货地址', 1)
      } else {
        const handleClose = Loading()
        const dspt = getStore('date', 'session').split('-')
        // 提交订单
        send('/jipiao/v1/order/create', {
          channel:        getStore('channel', 'session'),
          customerUserId: getStore('customerUserId', 'session'),
          airlineName,
          departure,
          arrive,
          date:           `${ dspt[0] }-${ (dspt[1] * 1) < 10 ? `0${ dspt[1] * 1 }` : dspt[1] }-${ dspt[2] * 1 < 10 ? `0${ dspt[2] * 1 }` : dspt[2] }`,
          deptTime:       departureTime,
          arriTime:       arriveTime,
          cabinType:      pricingData.cabinType,
          flightNum,
          contactor,
          identityIds,
          invoice,
          insuranceList:  temp,
          bkParams,
          activityId,
          couponId,
          flightTypeFullName,
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

const mapFunToComponent  = (dispatch, state) => ({
  componentWillMount: () => {
    timeOut = setTimeout(() => {
      alert('', '航班信息可能已过期，请重新搜索', [
        {
          text:    '确定',
          onPress: () => {
            browserHistory.push('/jipiao/air')
            window.location.reload()
          },
        },
      ])
    }, 600000)
  },

  componentWillUnmount: () => {
    clearTimeout(timeOut)
  },
  componentDidMount: () => {
    const { routeParams } = state
    const { flightNum, flightTimes, flightTypeFullName, index } = routeParams
    const pricing = flightData => {
      const { departureTime, airlineName } = flightData
      const { bkParams } = flightData.priceList[index]
      // 核价
      send('/jipiao/v1/pricing', {
        channel:   getStore('channel', 'session'),
        departure: getStore('fromCity'),
        arrive:    getStore('toCity'),
        date:      getStore('date', 'session'),
        deptTime:  departureTime,
        airlineName,
        flightNum,
        bkParams,
      })
      .then(({ code, data, message }) => {
        if (code === 0) {
          dispatch(ordReset({
            pricingData:    data,
            contactorPhone: getStore('userPhone', 'session') || '',
          }))
        } else {
          console.log(message)
        }
      })
    }
    // 查询详情
    get('/jipiao/v1/flight/price', {
      channel:   getStore('channel', 'session'),
      departure: getStore('fromCity'),
      arrive:    getStore('toCity'),
      date:      getStore('date', 'session'),
      flightNum,
      flightTimes,
    })
    .then(({ code, data, message }) => {
      if (code === 0) {
        pricing(data)
        data.flightTypeFullName = flightTypeFullName
        dispatch(ordReset({
          flightData: data,
        }))
      } else {
        console.log(message)
      }
    })
    // 查询保险
    get('/baoxian/v1/insurance/query', {
      channel:  'dashubao',
      category: 'jipiao',
    })
    .then(({ code, data, message }) => {
      if (code === 0) {
        dispatch(ordReset({
          baoxianData: data,
        }))
      } else {
        console.log(message)
      }
    })
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Order)
)
