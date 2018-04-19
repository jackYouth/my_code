import { Toast } from 'antd-mobile'
import { getStore, setStore } from '@boluome/common-lib' // get, send,
import { Loading } from '@boluome/oto_saas_web_app_component'
import { afterOrdering, get, send } from 'business'

// 根据点击选中商品的ID  请求订单页面的商品信息数据
export const OrderDataList = () => dispatch => {
  const handleClose = Loading()
  const id = getStore('goOrderId', 'session')
  const listUrl = `/menpiao/v1/goods/${ id }`
  get(listUrl, { channel: 'lvmama' })
  .then(({ code, data, message }) => {
    if (code === 0) { // console.log('数据order-----',data ,id);
      dispatch({
        type:          'kJIN_ORDERLISTDATA',
        OrderListData: data,
      })
      dispatch({
        type:         'kJIN_ORDERTIMEDATA',
        TimeListData: data.prices,
      })
      dispatch({
        type:       'COUNTPTICES',
        countPrice: data.prices[0].sellPrice,
      })
      const pricesData = {}
      const chooseTime = getStore('chooseTime', 'session')
      if (chooseTime && chooseTime.price) {
        dispatch({ type: 'CHOOSE_TYPE', chooseType: 2 })
        pricesData.date = chooseTime.date
        pricesData.price = chooseTime.price
        dispatch({ type: 'COUNTPTICES', countPrice: chooseTime.price })
      } else {
        // if (data.prices) {
        pricesData.date = data.prices[0].date
        pricesData.price = data.prices[0].sellPrice
        dispatch({ type: 'KJIN_MORENPRICE', morenPrice: pricesData })
        // }
      }
      setStore('priceDate', data.prices, 'session')
    } else {
      console.log('数据加载失败-数据order', message)
    }
    handleClose()
  })
}
// 根据userid 查询出常用旅客信息
export const GetTouristList = () => dispatch => {
  const handleClose = Loading()
  const userId = getStore('customerUserId', 'session')
  get('/user/v1/identities', { userId })
  .then(({ code, data, message }) => {
    // code = 0
    // data = [{'name':'tst','phone':'13812345678','gender':0,'longitude':121.48789949,'latitude':31.24916171,'province':'上海市','provinceId':'310000','city':'上海市','cityId':'310000','county':'闸北区','countyId':'310108','address':'新荟城','detail':'上海市闵行区莲花南路1388号','isDefault':0,'tag':'','status':0,'contactId':'1483087753105','userId':'blm_test'}]
    if (code === 0) {
      // console.log('data----',data);
      dispatch({ type: 'kJIN_TOURISTLISTDATA', TouristData: data })
    } else {
      console.log('数据加载失败-旅客', message)
    }
    handleClose()
  })
}
// 提交订单
export const SaveOrder = (OrderListData, goodsCardata, countPrice, sum, morenPrice, curDiscountData = { discount: 0, coupon: '', activities: '' }, emailVal) => { // console.log('goodsCardata',goodsCardata);
  const handleClose = Loading()
  const orderUrl = '/menpiao/v2/order/save'
  const userId = getStore('customerUserId', 'session')
  const name = getStore('userSelfName', 'session')
  const phone = getStore('userSelfPhone', 'session')
  const travellerList = []
  const couponId = curDiscountData.coupon ? curDiscountData.coupon.id : ''
  const activityId = curDiscountData.activities ? curDiscountData.activities.id : ''
  console.log('test数据', OrderListData)
  for (let i = 0; i < goodsCardata.length; i++) {
    const obj = {
      count:      goodsCardata[i].count,
      identityId: goodsCardata[i].id,
    }
    travellerList.push(obj)
  }
  const { id } = OrderListData
  const { date } = morenPrice
  const sendData = {
    channel:        'lvmama',
    customerUserId: userId,
    price:          countPrice,
    userPhone:      phone,
    couponId,
    activityId,
    product:        {
      goodsId:   id,
      quantity:  sum,
      visitDate: date,
    },
    booker:         {
      name,
      mobile: phone,
      email:  emailVal,
    },
    travellers: travellerList,
  }
  console.log(JSON.stringify(sendData))
  send(orderUrl, sendData)
  .then(({ code, data, message }) => {
    if (code === 0) {
      console.log('下单成功')
      setStore('userSelfPhone', '', 'session')
      setStore('userSelfName', '', 'session')
      // window.location.href = `/cashier/${ data.id }`
      afterOrdering(data)
    } else {
      console.log('数据加载失败-下单', message)
      Toast.info(`${ message }`)
    }
    handleClose()
  })
}
