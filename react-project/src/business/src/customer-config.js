import { setStore, appendJs, moment, stringifyQuery } from '@boluome/common-lib'
import get from './get'
import customer from './customer'
import isTest   from './is-test'
import isStg   from './is-stg'

// 获取用户配置
const fetchConfig = callback => {
  get('/basis/v1/main/info').then(({ code, data, message }) => {
    if (code === 0) {
      setStore('customerConfig', data, 'session')
      callback()
    } else {
      callback(message)
    }
  }).catch(err => {
    callback(err)
  })
}
// 加载sdk
const loadSdk = callback => {
  const bridge = customer('bridge')
  if (bridge) {
    bridge.loadSDK(() => {
      callback()
    })
  }
}
// 添加客户的bridge文件
const appendBridge = (customerCode, callback, host = 'blm') => {
  let newCustomerCode
  let newProtocol = location.protocol
  if (isTest()) {
    host = 'dev-me'
    newProtocol = 'https:'
  } else if (isStg()) {
    host = 'stg-blm'
  }
  if (customerCode.indexOf('dev-') > -1) {
    newCustomerCode = customerCode.split('-')[1]
  } else {
    newCustomerCode = customerCode
  }
  const url  = `${ newProtocol }//${ host }.otosaas.com/static/${ newCustomerCode }.js`
  console.log('url', url)
  const ts   = moment('x')()
  appendJs(`${ url }${ stringifyQuery({ ts }) }`, callback)
}
// 加载对方sdk
export default (
  (customerCode, callback) => {
    setStore('customerCode', customerCode, 'session')
    fetchConfig(err => {
      if (err) {
        callback(err)
      } else {
        appendBridge(customerCode, () => loadSdk(callback))
      }
    })
  }
)
