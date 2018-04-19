/*
 * 下单之后的处理
 */
import { getStore, setStore } from '@boluome/common-lib'
import { contains } from 'ramda'
import pay      from './pay'
import customer from './customer'

export default (
  order => {
    const { showCashier, process } = customer()
    const { afterOrdering } = process
    const { id, subId = '', orderType = '' } = order
    const customerUserId = getStore('customerUserId')
    const localOrderObj = getStore(`${ customerUserId }_orderList_${ orderType }`)
    const orderList = (localOrderObj && localOrderObj.orderList) || []
    if (orderList.length > 0) {
      setStore(`${ customerUserId }_orderList_${ orderType }`, {
        orderList: [order].concat(orderList),
        customerUserId,
        date: getStore(`${ customerUserId }_orderList_${ orderType }`).date,
      })
    }

    afterOrdering(err => {
      if (err) return
      if (showCashier) {
        if (/yongche|chongzhi|huafei|liuliang/.test(location.pathname)) {
          location.href = `/cashier/${ id }`
          return
        }
        if (location.pathname.match('cashier') == null) {
          if (contains(orderType)(['huafei', 'liuliang', 'chongzhi', 'jiayouka', 'yongche'])) {
            location.href = `/cashier/${ id }/?subId=${ subId }&orderType=${ orderType }`
            return
          }
          location.replace(`/cashier/${ id }/?subId=${ subId }&orderType=${ orderType }`)
        }
      } else {
        const { payments } = getStore('customerConfig', 'session')
        pay(payments[0])(order)
      }
    })
  }
)
