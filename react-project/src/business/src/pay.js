// import { getStore, stringifyQuery }   from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
// import { Toast } from 'antd-mobile'
import customer from './customer'

let handleClose
const paySuccess = () => {
  handleClose()
  // Toast.success('支付成功', 3)
  // const customerUserId = getStore('customerUserId', 'session')
  // setTimeout(() => {
  //   location.href = `${ url }${ stringifyQuery({ customerUserId }) }`
  // }, 3000)
}

const payFail = () => {
  handleClose()
  // Toast.fail(word, 3)
}

export default (
  ({ channelCode }) => order => {
    const { pay = () => {} } = customer('bridge')
    handleClose = Loading()
    pay(channelCode, order, paySuccess, payFail)
  }
)
