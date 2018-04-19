import { connect } from 'react-redux'
import { getStore } from '@boluome/common-lib'
import { send } from 'business'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'

import { getHistoryBillInfo, getOrgInfo } from '../actions/billInfo.js'

import BillInfo from '../components/BillInfo.js'


const formatDate = i => {
  const date = new Date()
  date.setMonth(date.getMonth() - i)
  const y = date.getFullYear()
  let m = date.getMonth() + 1
  m = String(m).length === 1 ? `0${ m }` : m
  const formatwdate = `${ y }年${ m }月`
  return { value: formatwdate, label: formatwdate }
}

const mapStateToProps = state => {
  const { billInfo } = state
  const [currentServer, currentOrg, queryInfo, currentBillInfo] =
    [
      getStore('currentServer', 'session').currentServer,
      getStore('currentOrg', 'session').currentOrg,
      getStore('queryInfo', 'session').queryInfo,
      getStore('currentBillInfo', 'session').currentBillInfo,
    ]
  const dates = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(formatDate)

  return {
    ...billInfo,
    currentOrg,
    currentServer,
    queryInfo,
    currentBillInfo,
    dates,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleDatesChange: queryInfo => dispatch(getHistoryBillInfo(queryInfo)),
    handleCodeCancel:  () => browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/adduser?queryType=2`),
    handleCodeConfirm: () => browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/adduser?queryType=0`),
  }
}

const mapFuncToCompoent = dispatch => {
  const getBillInfo = queryInfo => {
    const handleClose = Loading()
    send('/shenghuojiaofei/v1/bills', queryInfo, { 'Content-Type': 'application/json' }).then(({ code, data, message }) => {
      if (code === 0) {
        const status = data.billList[0].status
        if (status === '00') {
          dispatch({ type: 'CHANGE_BILL_INFO', billInfo: { type: 'bill', data } })
        } else {
          dispatch({ type: 'CHANGE_BILL_INFO', billInfo: { type: 'noBill', tips: '暂未查询到欠费' } })
        }
      } else if (code === -1) {
        dispatch({ type: 'CHANGE_BILL_INFO', billInfo: { type: 'noBill', tips: '暂未查询到欠费', subTips: '' } })
      } else if (code === 20) {
        dispatch({ type: 'CHANGE_BILL_INFO', billInfo: { type: 'errorBill', tips: '缴费信息有误', subTips: '请确认缴费信息后重新查询' } })
      } else {
        Toast.fail(message, 1)
        dispatch({ type: 'CHANGE_BILL_INFO', billInfo: { type: '', tips: '' } })
      }
      handleClose()
    }).catch(({ message }) => {
      console.log(message)
      handleClose()
    })
  }

  return {
    componentWillMount: () => {
      // 首先清除页缓存中billinfo的数据
      dispatch({ type: 'CHANGE_BILL_INFO', billInfo: '' })

      const queryInfo = getStore('queryInfo', 'session').queryInfo
      getBillInfo(queryInfo)

      const { billCityId, orgId } = queryInfo
      dispatch({ type: 'SHOW_BEIJING_INPUT', showPriceIpt: billCityId === '0111' })
      dispatch(getOrgInfo({ cityId: billCityId, orgId }))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFuncToCompoent)(BillInfo))
