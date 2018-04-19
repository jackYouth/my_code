import { connect } from 'react-redux'
import { Toast } from 'antd-mobile'
import { wrap, Mask }    from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'
import Order         from '../components/order'
import { orderDeliverTime, getOptimalContact, deliverFee, handleGoOrder } from '../actions/order'

const mapStateToProps = state => {
  const { order } = state
  const { orderTimeDate,
    serviceDate, contact, shoppingAddr, displayTag,
    deliverFees, textareaStr, files, tipsPrice, Promotion,
    focused,
  } = order
  // console.log('order--', state, order)
  return {
    orderTimeDate,
    serviceDate,
    contact,
    shoppingAddr,
    displayTag,
    deliverFees,
    textareaStr,
    files,
    tipsPrice,
    Promotion,
    focused,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    // 处理删除 或者添加购买地址
    handleChangeAddr: v => {
      console.log(v)
      const serviceDate = getStore('paotui_serviceDate', 'session')
      const contact = getStore('paotui_contact', 'session')
      let merchant = ''
      if (v) {
        merchant = {
          title:   v.name,
          address: v.name + v.address,
          lat:     v.location.lat,
          lng:     v.location.lng,
        }
        setStore('paotui_merchant', merchant, 'session')
      } else {
        setStore('paotui_merchant', '', 'session')
      }
      dispatch({ type: 'SHOPPING_ADDR', shoppingAddr: merchant })
      dispatch(deliverFee(serviceDate, contact))
    },
    handleChangeContact: contact => {
      console.log('handleChangeContact---', contact)
      const serviceDate = getStore('paotui_serviceDate', 'session')
      setStore('paotui_contact', contact, 'session')
      dispatch({ type: 'CONTACT', contact })
      dispatch(deliverFee(serviceDate, contact))
    },
    handleChangeTime: time => {
      const contact = getStore('paotui_contact', 'session')
      dispatch({
        type:        'KJIN_DELIVERTIME',
        serviceDate: time,
      })
      setStore('paotui_serviceDate', time, 'session')
      if (contact) {
        dispatch(deliverFee(time, contact))
      }
    },
    // 处理untis
    handleUnits: untis => {
      const textareaDom = document.querySelector('textarea')
      textareaDom.scrollTop = (textareaDom.scrollHeight + textareaDom.clientHeight)
      // console.log(textareaDom.scrollTop, textareaDom.scrollHeight, textareaDom.clientHeight)
      let textarea = getStore('paotui_textarea', 'session')
      if (!textarea) {
        textarea = ''
      }
      const untisStr = `${ textarea + untis } ,`
      setStore('paotui_textarea', untisStr, 'session')
      dispatch({ type: 'TEATAREAOrder', textareaStr: untisStr })
    },
    // 处理productname
    handleProductName: item => {
      let textarea = getStore('paotui_textarea', 'session')
      if (!textarea) {
        textarea = ''
      }
      const productName = getStore('paotui_productName', 'session')
      let arr = []
      if (productName.length === 0) {
        setStore('paotui_productName', [item.productName], 'session')
        dispatch({ type: 'TEATAREAOrder', textareaStr: item.productName })
      } else {
        arr = productName.filter(o => { return o === item.productName })
      }
      if (arr.length > 0) {
        console.log('已经有了')
      } else {
        productName.push(item.productName)
        setStore('paotui_productName', productName, 'session')
        textarea = `${ textarea + item.productName }  `
      }
      setStore('paotui_textarea', textarea, 'session')
      dispatch({ type: 'TEATAREAOrder', textareaStr: textarea })
      const textareaDom = document.querySelector('textarea')
      textareaDom.scrollTop = (textareaDom.scrollHeight + textareaDom.clientHeight)
    },
    handleChangeName: (v, contact) => {
      contact.name = v
      dispatch({ type: 'CONTACT', contact })
    },
    handleChangePhone: (ref, contact) => {
      // console.log('handleChangePhone---', ref)
      contact.phone = ref.replace(/\s/g, '')
      dispatch({ type: 'CONTACT', contact })
    },
    handleAddMerchant: v => {
      // const merchant = getStore('paotui_merchant', 'session')
      // merchant.address += v
      // console.log('handleAddMerchant', merchant.address)
      // setStore('paotui_merchant', merchant, 'session')
      setStore('paotui_merchant_self', v, 'session')
    },
    // 返回的填入状态里面
    changeText: () => {
      const text = getStore('paotui_textarea', 'session')
      const file = getStore('paotui_imgSrc', 'session')
      dispatch({ type: 'TEATAREAOrder', textareaStr: text })
      dispatch({ type: 'IMGSRC_FILES', files: file })
    },
    handletipsPrice: price => {
      dispatch({ type: 'TIPSPRICE', tipsPrice: price })
    },
    handlePromotion: reply => {
      // console.log(reply)
      dispatch({ type: 'PROMOTION', Promotion: reply })
    },
    handleSaveBtn: (tipsPrice, contact, merchant, serviceDate, Promotion, deliverFees) => {
      if (contact) {
        const textareaStr = getStore('paotui_textarea', 'session')
        const files = getStore('paotui_imgSrc', 'session')
        console.log(files)
        const { name, phone } = contact
        const tel = phone.replace(/\s/g, '')
        if (!textareaStr) {
          Toast.info('请填写或选择你要的物品', 2)
          return
        }
        if (!name) {
          Toast.info('请填写姓名', 2)
          return
        }
        if (!(/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/.test(tel))) {
          Toast.info('请填写正确手机', 2)
          return
        }
        contact.phone = tel
        dispatch(handleGoOrder(tipsPrice, contact, merchant, serviceDate, Promotion, deliverFees))
      } else {
        Toast.info('请选择收货地址', 2)
      }
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    document.title = '随意购-什么都能买'
    dispatch(orderDeliverTime())
  },
  componentDidMount: () => {
    const contact = getStore('paotui_contact', 'session')
    const displayTag = getStore('paotui_displayTag', 'session')
    const shoppingAddr = getStore('paotui_merchant', 'session')
    const files = getStore('paotui_imgSrc', 'session')
    const textareaStr = getStore('paotui_textarea', 'session')
    dispatch({ type: 'SHOPPING_ADDR', shoppingAddr })
    // 如果是选择收货地址在这里处理事件
    if (contact) {
      dispatch({
        type:           'KJIN_OPTIMALCONTACT',
        OptimalContact: contact,
      })
      dispatch(orderDeliverTime(contact))
      const serviceDate = getStore('paotui_serviceDate', 'session')
      dispatch(deliverFee(serviceDate, contact))
      dispatch({ type: 'CONTACT', contact })
    } else {
      const latOrlng = getStore('geopoint', 'session')
      dispatch(getOptimalContact(latOrlng))
      // dispatch({ type: 'CONTACT', contact: '' })
    }
    dispatch({ type: 'DISPLAYTAG', displayTag })
    if (textareaStr) {
      dispatch({ type: 'TEATAREAOrder', textareaStr })
    } else {
      dispatch({ type: 'TEATAREAOrder', textareaStr: '' })
    }
    if (files) {
      dispatch({ type: 'IMGSRC_FILES', files })
    }
  },
  componentWillUnmount: () => {
    Mask.closeAll()
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Order)
)
