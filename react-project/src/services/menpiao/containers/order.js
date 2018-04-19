import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Modal, Toast }    from 'antd-mobile'
import { wrap, Mask } from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'

import Order from '../components/order'
import { OrderDataList, GetTouristList, SaveOrder } from '../actions/order'

const alert = Modal.alert
const mapStateToProps = state => {
  // console.log('menpiaoorder-------',order ,'-----',details);
  // console.log('state----',state);
  const { order, details } = state
  const { TimeListData, TouristData } = details
  const { OrderListData, goodsCardata,
    sum, countPrice, chooseType, morenPrice,
    name, phone, curDiscountData, discount, emailVal,
  } = order
  return {
    GetTouristList,
    OrderDataList,
    OrderListData,
    TimeListData,
    TouristData,
    goodsCardata,
    sum,
    countPrice,
    chooseType,
    morenPrice,
    name,
    phone,
    curDiscountData,
    discount,
    emailVal,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleGoaddrMap: res => {
      setStore('goodsNameAddr', res, 'session')
      browserHistory.push('/menpiao/addrBumap')
      // window.location.href = '/menpiao/addrBumap'
    },
    handleGoMoreDate: () => {
      browserHistory.push('/menpiao/moreDate')
      // window.location.href = '/menpiao/moreDate'
    },
    // 当返回数据有最小值
    handleMinimum: minimum => {
      // dispatch({ type: 'SUM', sum: minimum })
      setStore('Orderminimum', minimum, 'session')
    },
    handleSumUP: uplimite => {
      const goodsCardata = getStore('goodsCardata', 'session')
      let sums = 1
      // 修改后的
      for (let n = 0; n < goodsCardata.length; n++) {
        sums += parseFloat(goodsCardata[n].count)
      }
      for (let k = 0; k < goodsCardata.length; k++) {
        if (sums <= uplimite) {
          goodsCardata[k].count++
          setStore('goodsCardata', goodsCardata, 'session')
        } else {
          sums = uplimite
          console.log('大于最大的了')
        }
      }
      dispatch({ type: 'SUM', sum: sums })
      dispatch({ type: 'GOODSCARDATA', goodsCardata })
    },
    handleNumDown: downlimite => { // console.log('2abc----',id,downlimite);
      const goodsCardata = getStore('goodsCardata', 'session')
      let sum = 0
      // 这里数量的减
      for (let j = 0; j < goodsCardata.length; j++) {
        sum += (parseFloat(goodsCardata[j].count)) // console.log('adddown',sum);
      }
      for (let s = 0; s < goodsCardata.length; s++) {
        if (sum > downlimite) {
          if (goodsCardata[s].count === 1) {
            goodsCardata[s].count = 1
            setStore('goodsCardata', goodsCardata, 'session')
          } else {
            --goodsCardata[s].count
            sum--
            setStore('goodsCardata', goodsCardata, 'session')
          }
        } else {
          sum = downlimite
          console.log('小于最小的了')
        }
      }
      dispatch({ type: 'SUM', sum })
      dispatch({ type: 'GOODSCARDATA', goodsCardata })
    },
    handleAddTourist: () => {
      browserHistory.push('/menpiao/AddTouristUse')
      // window.location.href = '/menpiao/AddTouristUse'
    },
    handleDeleteTuorist: Markid => {
      alert('删除', '确定删除么?', [
        { text: '取消', onPress: () => console.log('cancel') },
        { text:    '确定',
          onPress: () => {
            const goodsCardata = getStore('goodsCardata', 'session')
            let countDelete = 0
            for (let i = 0; i < goodsCardata.length; i++) {
              if (goodsCardata[i].id === Markid) {
                goodsCardata.splice(i, 1)
                setStore('goodsCardata', goodsCardata, 'session')
              }
            }
            const deleteCardata = getStore('goodsCardata', 'session')
            if (deleteCardata.length !== 0) {
              for (let j = 0; j < deleteCardata.length; j++) {
                countDelete += deleteCardata[j].count
              }
            } else {
              countDelete = 0
            }
            dispatch({ type: 'SUM', sum: countDelete })
            dispatch({ type: 'GOODSCARDATA', goodsCardata })
          },
          style: { fontWeight: 'bold' } },
      ])
    },
    handleGetprice: (type, PriceChoose) => {
      setStore('countPrice', PriceChoose, 'session')
      if (type === 0) {
        dispatch({ type: 'CHOOSE_TYPE', chooseType: 0 })
      } else if (type === 1) {
        dispatch({ type: 'CHOOSE_TYPE', chooseType: 1 })
      } else if (type === 2) {
        dispatch({ type: 'CHOOSE_TYPE', chooseType: 2 })
      }
      if (PriceChoose) {
        const pricesData = {}
        pricesData.date = PriceChoose.date
        pricesData.price = PriceChoose.sellPrice
        setStore('chooseTime', '', 'session')
        dispatch({ type: 'KJIN_MORENPRICE', morenPrice: pricesData })
        dispatch({ type: 'COUNTPTICES', countPrice: PriceChoose.sellPrice })
      }
    },
    handleChange: res => {
      console.log(res)
    },
    // 优惠变更
    handleReliefChange: reply => {
      dispatch({ type: 'DISCOUNT', discount: reply.discount })
      dispatch({ type: 'KJIN_PROMOTION', curDiscountData: reply })
    },
    // 提交订单
    handleSaveOrder: (OrderListData, goodsCardata, countPrice, sum, morenPrice, curDiscountData, emailVal) => {
      const { traveller = {} } = OrderListData
      const { email } = traveller
      if (email !== 'TRAV_NUM_NO') {
        if (!emailVal) {
          Toast.info('请输入电子邮箱！', 1)
          return
        }
        const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
        if (!reg.test(emailVal)) {
          Toast.info('邮箱格式不正确，请重新输入！', 1)
          return
        }
      }
      dispatch(SaveOrder(OrderListData, goodsCardata, countPrice, sum, morenPrice, curDiscountData, emailVal))
    },
    // 在需要邮箱的时候处理
    handleEmailvalue: val => {
      dispatch({ type: 'EMAIL_VALUE', emailVal: val })
      setStore('menpiao_email', val, 'session')
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    const email = getStore('menpiao_email', 'session')
    dispatch({ type: 'EMAIL_VALUE', emailVal: email })
  },
  componentDidMount: () => {
    const bodyHeight = document.body.clientHeight
    dispatch({ type: 'ORDERHEIGHT', orderHeight: bodyHeight })
    const goodsCardata = getStore('goodsCardata', 'session')
    dispatch({ type: 'GOODSCARDATA', goodsCardata })
    if (goodsCardata && goodsCardata.length > 0) {
      let sum = 0
      // 这里数量的减
      for (let j = 0; j < goodsCardata.length; j++) {
        sum += parseFloat(goodsCardata[j].count)
      }
      dispatch({ type: 'SUM', sum })
    }
    const chooseTime = getStore('chooseTime', 'session')
    if (chooseTime && chooseTime.price) {
      dispatch({ type: 'CHOOSE_TYPE', chooseType: 2 })
      const pricesData = {}
      pricesData.date = chooseTime.date
      pricesData.price = chooseTime.price
      dispatch({ type: 'KJIN_MORENPRICE', morenPrice: pricesData })
      dispatch({ type: 'COUNTPTICES', countPrice: chooseTime.price })
    }
    dispatch(OrderDataList())
    dispatch(GetTouristList())
  },
  componentWillUnmount: () => {
    dispatch({ type: 'CHOOSE_TYPE', chooseType: 0 })
    dispatch({ type: 'COUNTPTICES', countPrice: 0 })
    dispatch({ type: 'SUM', sum: 1 })
    Mask.closeAll()
    const num = document.getElementsByClassName('mask-container').length
    for (let i = 0; i < num; i++) {
      document.getElementsByClassName('mask-container')[0].parentNode.remove()
    }
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Order)
)
