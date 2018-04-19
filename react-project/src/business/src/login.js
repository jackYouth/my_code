import { setStore, getStore } from '@boluome/common-lib'
import { merge } from 'ramda'
import get from './get'
import customer from './customer'

let loginSuccessCallback

// 在storage里同步数据
const saveToStore = (k, v) => {
  setStore(k, v, 'session')
  setStore(k, v)
}

// 获取品类
const getCategoryCode = () => {
  const pathname = location.pathname.substring(1)
  const index    = pathname.indexOf('/')
  let name
  if (index > 0) { name = pathname.substr(0, index) } else { name = pathname }
  if (name === 'dazhaxie') { name = 'ych' }
  return name
}
// 登陆成功
const loginSuccess = ({ customerUserId = '', customerUserPhone = '', token = '', extra = '' }) => {
  saveToStore('customerUserId', customerUserId.toString())
  saveToStore('userPhone', customerUserPhone.toString())
  saveToStore('accessToken', token.toString())
  saveToStore('customerExtra', extra)
  loginSuccessCallback(null, { customerUserId, userPhone: customerUserPhone, token })
}
// 获取用户信息
const fetchUserInfo = query => {
  const bindeUserUrl = /192.168.|localhost/
                      .test(location.hostname)
                      ? '/basis/bindUser/v1'
                      : '/bindUser/v1'
  get(bindeUserUrl, merge(query, { categoryCode: getCategoryCode() }))
  .then(({ code, data, message }) => {
    if (code === 0) {
      loginSuccess(data)
      console.log('bindUser success', data)
    } else {
      loginSuccessCallback(message)
      console.log('bindeUser err1', message)
    }
  }).catch(err => loginSuccessCallback('bindeUser err2', err))
}
// 登陆
export default (
  (callback, isRealLogin = false) => {
    loginSuccessCallback = callback
    const customerUserId = getStore('customerUserId', 'session')
    const userPhone = getStore('userPhone', 'session')
    const accessToken = getStore('accessToken', 'session')
    const needLoginArr = ['huafei', 'liuliang', 'chongzhi', 'jiayouka', 'weizhang', 'coffee', 'yongche', 'shenghuojiaofei', 'service', 'daijia']
    if (customerUserId !== null && typeof customerUserId !== 'undefined' && userPhone !== null && typeof userPhone !== 'undefined') {
      callback(null, { customerUserId, userPhone, token: accessToken })
    } else {
      const { login = () => {} } = customer('bridge')
      const { requireLogin = false } = customer()
      if (requireLogin && !(needLoginArr.some(i => { return i === getCategoryCode() })) && !isRealLogin) {
        callback(null, {})
      } else {
        login((err, loginParams) => {
          if (err) {
            console.log('bindeUser err3', err)
          } else {
            // 测试常规登录
            // const arr = ['customerUserId', 'customerUserPhone', 'appKey', 'timestamp', 'sign']
            // const has = Object.keys(loginParams).filter(i => arr.some(e => i === e))
            // const sendData = {}
            // has.map(o => {
            //   return sendData[o] = loginParams[o]
            // })
            // // console.log('---sendData---', sendData)
            fetchUserInfo(loginParams)
            // fetchUserInfo(sendData)
          }
        })
      }
    }
  }
)
