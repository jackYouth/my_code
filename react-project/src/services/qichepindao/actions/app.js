// import { getStore } from '@boluome/common-lib'
// import { Loading } from '@boluome/oto_saas_web_app_component'
import { get } from 'business'
import you from '../img/you.png'
import weizhang from '../img/weizhang.png'
import chafen from '../img/chafen.png'
import chegu from '../img/chegu.png'
import xiche from '../img/xiche.png'
import meirong from '../img/meirong.png'
import daijia from '../img/daijia.png'
import zhuanche from '../img/zhuanche.png'

export const appReset = data => ({
  type: 'ADD_RESET',
  ...data,
})

const sindustryData = [
  {
    title:     '油卡充值',
    logo:      you,
    orderType: 'jiayouka',
  },
  {
    title:     '违章代缴',
    logo:      weizhang,
    orderType: 'weizhang',
  },
  {
    title:     '驾照查分',
    logo:      chafen,
    orderType: 'jiazhao',
  },
  {
    title:     '车辆估值',
    logo:      chegu,
    orderType: 'chegu',
  },
  {
    title:     '洗车',
    logo:      xiche,
    orderType: 'baoyang',
  },
  {
    title:     '美容养护',
    logo:      meirong,
    orderType: 'baoyang',
  },
  {
    title:     '车主代驾',
    logo:      daijia,
    orderType: 'daijia',
  },
  {
    title:     '专车',
    logo:      zhuanche,
    orderType: 'zhuanche',
  },
]

export const getData = (name, city, county, geopoint) => dispatch => {
  get('/daojia/v1/life/home', {
    city,
    county,
    longitude:    geopoint.longitude,
    latitude:     geopoint.latitude,
    industryCode: 'mms_daojiabaojie,mms_daojiajiadianqingxi',
  }).then(({ code, data, message }) => {
    if (code === 0) {
      console.log(data, dispatch)
      const { bannerData } = data
      dispatch(appReset({
        bannerData,
        sindustryData,
        name,
        city,
        geopoint,
      }))
    } else {
      dispatch(appReset({
        name,
        city,
        geopoint,
      }))
      console.log(message)
    }
  })
}

export const fetchShop = geopoint => dispatch => {
  const postData = {
    channel:   'diandian',
    latitude:  geopoint.latitude,
    longitude: geopoint.longitude,
    offset:    0,
    limit:     10,
  }
  get('/baoyang/v1/near/shop', postData)
  .then(({ code, message, data = [] }) => {
    if (code === 0) {
      dispatch(appReset({
        serviceData: data,
        geopoint,
      }))
    } else {
      console.log(message)
    }
  })
}

// 违章查询
export const getWeizhangData = ({ userId, carPhone, plateNumber, vin, engineNo, cityId }) => dispatch => {
  const sendUrl = '/weizhang/v1/query'
  const channel = 'chexingyi'
  const sendData = {
    channel,
    userId,
    phone: carPhone,
    carPhone,
    plateNumber,
    vin,
    engineNo,
    cityId,
  }
  get(sendUrl, sendData).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch(appReset({ ...data }))
    } else {
      console.log(message)
    }
  })
}

// 验证车牌有效性
// export const TestData = () => dispatch => {
//   const userId = getStore('customerUserId', 'session')
//   const sendUrl = '/weizhang/v1/check/user/plates'
//   const sendData = {
//     channel: 'chexingyi',
//     userId,
//   }
//   get(sendUrl, sendData).then(({ code, data, message }) => {
//     if (code === 0) {
//       console.log('data-ccc----', data)
//       if (data && data.length > 0) {
//         dispatch(appReset({ testplatData: data }))
//       }
//     } else {
//       console.log(message)
//     }
//   })
// }
