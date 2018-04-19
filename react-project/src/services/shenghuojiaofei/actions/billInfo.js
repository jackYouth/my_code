import { Loading } from '@boluome/oto_saas_web_app_component'
import { getStore } from '@boluome/common-lib'
import { send, get } from 'business'
import { Toast } from 'antd-mobile'

export const getHistoryBillInfo = queryInfo => dispatch => {
  const handleClose = Loading()
  const userId = getStore('customerUserId', 'session')
  queryInfo.userId = userId
  queryInfo.cityId = queryInfo.billCityId
  send('/shenghuojiaofei/v1/history', queryInfo).then(({ code, data, message }) => {
    if (code === 0) {
      const status = data.billList[0].status
      if (status === '00') {
        dispatch({ type: 'CHANGE_BILL_INFO', billInfo: { type: 'bill', data } })
      } else {
        dispatch({ type: 'CHANGE_BILL_INFO', billInfo: { type: 'historyBill', data } })
      }
    } else if (code === -2 || code === -1) {
      dispatch({ type: 'CHANGE_BILL_INFO', billInfo: { type: 'historyNoBill', tips: '暂未查询到该月账单信息', subTips: '无记录或已销账建议使用本平台缴费记录您的缴费生活' } })
    } else {
      Toast.fail(message, 1)
    }
    handleClose()
  }).catch(({ message }) => {
    console.log('getHistoryBillInfo', message)
    handleClose()
  })
}


export const getOrgInfo = paras => dispatch => {
  const closeLoading = Loading()
  get('/shenghuojiaofei/v1/org', paras).then(({ code, data }) => {
    let showQueryHistory = false
    if (code === 0 && (data.queryTypes.length >= 2 || data.queryTypes[0].type !== '2')) {
      showQueryHistory = true
    }
    dispatch({ type: 'SET_CURRENT_ORG_DETAIL', showQueryHistory })
    closeLoading()
  })
}
