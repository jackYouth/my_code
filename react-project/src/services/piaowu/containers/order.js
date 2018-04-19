import { connect } from 'react-redux'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { parseQuery, get, getStore, send }  from '@boluome/common-lib'
import { Toast } from 'antd-mobile'
import { afterOrdering } from 'business'
import { derReset } from '../actions/order.js'
import Order from '../components/order'

const mapStateToProps = state => {
  const { order } = state
  return {
    ...order,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,

    handleSubmit: (curDiscountData, contacts, receivingStyle, receName, recePhone) => {
      const channel = getStore('piaowu_channel', 'session')
      const search = parseQuery(location.search)
      const { activityCode, eventId, ticketsId, num } = search
      const activityId =  curDiscountData.activities ? curDiscountData.activities.id : ''
      const couponId =  curDiscountData.coupon ? curDiscountData.coupon.id : ''
      const reg = /^1[34578]\d{9}$/
      if (receivingStyle === 1 && !contacts) {
        Toast.info('未选择收货地址', 1)
      } else if (receivingStyle !== 1 && !receName && !recePhone) {
        Toast.info('未填写取票人信息', 1)
      } else if (receivingStyle !== 1 && !(reg.test(recePhone))) {
        Toast.info('请输入正确手机号', 1)
      } else {
        const contactId = contacts ? contacts.contactId : ''
        const contact = {
          name:  receName,
          phone: recePhone,
        }
        const handleClose = Loading()
        send('/piaowu/saveOrder', {
          customerUserId: getStore('customerUserId', 'session'),
          userPhone:      getStore('userPhone', 'session'),
          quantity:       num * 1,
          dispatchWay:    receivingStyle,
          ticketId:       ticketsId,
          channel,
          contact,
          contactId,
          activityCode,
          eventId,
          couponId,
          activityId,
        }).then(({ code, data, message }) => {
          handleClose()
          if (code === 0) {
            console.log(data)
            afterOrdering(data)
          } else {
            console.log(message)
            Toast.info(message)
          }
        })
        .catch(err => {
          console.log(err)
          handleClose()
          Toast.info('网络错误')
        })
      }
    },

    handleCur: curDiscountObj => {
      dispatch(
        derReset({
          curDiscountData: curDiscountObj,
        })
      )
    },

    handleChangePhone: recePhone => {
      dispatch(derReset({
        recePhone,
      }))
    },

    handleChangeName: receName => {
      dispatch(derReset({
        receName,
      }))
    },

    handleChangereceivingStyle: receivingStyle => {
      if (receivingStyle) dispatch(derReset({ receivingStyle }))
    },

    handleChangecontact: contact => {
      if (contact) {
        const channel = getStore('piaowu_channel', 'session')
        const search = parseQuery(location.search)
        const { ticketsId } = search
        get('/piaowu/estimateShippingFee', {
          channel,
          ticketsId,
          countyId: contact.countyId,
        }).then(({ code, data, message }) => {
          if (code === 0) {
            console.log(data)
            dispatch(derReset({ contact, fee: data || 10 }))
          } else {
            console.log(message)
            dispatch(derReset({ contact, fee: 10 }))
          }
        })
        .catch(err => {
          console.log(err)
          Toast.info('网络错误')
        })
      }
    },
  }
}

const mapFunToComponent  = dispatch => {
  return {
    componentWillMount: () => {
      const search = parseQuery(location.search)
      const { activityCode, eventId, ticketsId, num } = search
      const channel = getStore('piaowu_channel', 'session')
      get('/piaowu/queryTicketDetail', {
        channel,
        activityCode,
        eventId,
        ticketsId,
      }).then(({ code, data, message }) => {
        if (code === 0) {
          console.log(data)
          const { ticket } = data
          const receivingArr = channel === 'xishiqu' ? [(ticket.receivingStyle * 1) + 1]
                                                     : [
                                                       ticket.receivingStyle,
                                                       ticket.kdpsDispatchWay ? 2 : 0,
                                                     ]
          dispatch(derReset({ ...data, channel, num, receivingArr, receivingStyle: receivingArr[0] || receivingArr[1] }))
        } else {
          console.log(message)
        }
      })
      .catch(err => {
        console.log(err)
        Toast.info('网络错误')
      })
    },
  }
}

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Order)
  )
