import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { wrap, Mask }    from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import Order from '../components/order'
import { orderDeliverTime, deliverFee, handleGoOrder } from '../actions/order'

const mapStateToProps = state => {
  // console.log('state---', state)
  const { order } = state
  const { tipsPrice, deliverFees,
    orderTimeDate, serviceDate, availableTime,
    merchant, goodsCartarr, contact,
    noteText, Promotion, visible,
  } = order
  return {
    tipsPrice,
    deliverFees,
    orderTimeDate,
    serviceDate,
    merchant,
    availableTime,
    goodsCartarr,
    contact,
    noteText,
    Promotion,
    handleGoOrder,
    visible,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    goContactEdit: () => {
      browserHistory.push('/coffee/editcontact')
    },
    handleChangeTips: v => {
      dispatch({ type: 'TIPSPRICE', tipsPrice: v })
    },
    handleServiceDate: (time, contact) => {
      console.log('--serviceDate--', time, time[0], time[1])
      if (time) {
        const serviceDate = `${ time[0] } ${ time[1] }`
        console.log('test---', serviceDate)
        dispatch({ type: 'KJIN_DELIVERTIME', serviceDate: time })
        dispatch(deliverFee(serviceDate, contact))
      }
    },
    handleNotesText: fn => {
      const text = document.getElementsByClassName('textarea')[0].value
      dispatch({ type: 'NOTESTEXT', noteText: text })
      Mask.closeAll()
      fn()
    },
    handlePromotion: reply => {
      dispatch({ type: 'PROMOTION', Promotion: reply })
    },
    handleTipsNotice: mark => {
      if (mark === 'show') {
        dispatch({ type: 'VISIBLE', visible: true })
      } else {
        dispatch({ type: 'VISIBLE', visible: false })
      }
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    const contact = getStore('coffee_contact', 'session')
    // console.log('componentWillMount---', contact)
    dispatch(orderDeliverTime(contact))
    const goodsCartarr = getStore('goodsCartarr', 'session')
    dispatch({ type: 'GOODS_CARTARR', goodsCartarr })
  },
  componentDidMount: () => {
    const availableTime = getStore('coffee_availableTime', 'session')
    const merchant = getStore('coffee_merchant', 'session')
    const serviceDate = getStore('coffee_serviceDate', 'session')
    const contact = getStore('coffee_contact', 'session')
    dispatch({ type: 'AVAILABLETIME', availableTime })
    dispatch({ type: 'MERCHANT', merchant })
    dispatch({ type: 'KJIN_DELIVERTIME', serviceDate })
    dispatch({ type: 'ORDER_CONTACT', contact })
    if (serviceDate) {
      const time = `${ serviceDate[0] } ${ serviceDate[1] }`
      dispatch(deliverFee(time, contact))
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Order)
)
