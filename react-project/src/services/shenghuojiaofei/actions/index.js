import { setStore, getStore, removeStore } from '@boluome/common-lib'
import { get, send } from 'business'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { Loading } from '@boluome/oto_saas_web_app_component'    // 引入loading图组件
import { merge } from 'ramda'

//  城市改变时，获取当前的service,三个参数：当前选中的城市信息，关闭遮罩，是否跳转页面
export const changeCity = (selectedCity, handleClose, isSelectCity) => dispatch => {
  dispatch({ type: 'CHANGE_CURRENT_CITY', selectedCity }) // 改变当前city的信息
  setStore('selectedCity', { selectedCity }, 'session')
  get('/shenghuojiaofei/v1/categories', { cityId: selectedCity.id, channel: 'chinaums' }).then(({ code, data, message }) => {
    if (code === 0) {
      dispatch({ type: 'CHANGE_CITY_SERVICE', service: data })
      if (isSelectCity) browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/?flag=selectCity`)
      if (handleClose) handleClose()
    } else {
      if (handleClose) handleClose()
      Toast.fail(message, 1)
    }
  })
}

export const delUserPage = res => dispatch => {   // res是一个数组，第一个是userCategory，第二个是currentOrg
  const customerUserId = sessionStorage.customerUserId
  send(`/shenghuojiaofei/v1/${ customerUserId }/${ res[1].tag }/${ res[1].billNo }`, {}, 'DELETE').then(({ code, message }) => {
    if (code === 0) {
      const newUserCategory = JSON.parse(JSON.stringify(res[0]))
      res[0].forEach((item, idx) => {
        if (item.tag === res[1].tag && item.billNo === res[1].billNo) {
          newUserCategory.splice(idx, 1)
        }
      })
      dispatch({ type: 'GET_USER_PAGE', userCategory: newUserCategory })
    } else {
      Toast.fail(message, 1)
    }
  })
}

//  下面是才分新接口，包含账单，home的增删改查

//  新删除家庭接口
export const newDelUserPage = paras => dispatch => {   // res是一个数组，第一个是userCategory，第二个是currentOrg
  const handleContainerClose = Loading()
  const userId = sessionStorage.customerUserId
  paras.userId = userId
  send('/shenghuojiaofei/v2/categories', paras, 'DELETE').then(({ code, data, message }) => {
    if (code === 0) {
      // 从当前userCategory中删除当前账单
      // const userCategory = getStore('userCategory', 'session').userCategory
      // userCategory.map(item => {
      //   if (item.tid === paras.tid) {
      //     item.tagInfo.filter(o => {
      //       if (o.bid !== paras.bid) {
      //         return true
      //       }
      //     })
      //   }
      //   return item
      // })

      // 从当前userCategory中删除当前账单
      dispatch({ type: 'GET_USER_PAGE', userCategory: data.userCategory })
      dispatch({ type: 'CHANGE_HOME_TAG', currentHomeTag: '' })
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }`)
    } else {
      Toast.fail(message, 1)
    }
    handleContainerClose()
  })
}

//  新编辑账单页面接口
export const newEditUserPage = (currentBillInfo, url) => () => {   // res是一个数组，第一个是userCategory，第二个是currentOrg
  const handleContainerClose = Loading()
  const customerUserId = sessionStorage.customerUserId
  const preBillNo = currentBillInfo.preBillNo ? currentBillInfo.preBillNo : ''
  setStore('currentBillInfo', { currentBillInfo }, 'session')
  send(`/shenghuojiaofei/v2/${ customerUserId }/category/${ preBillNo }`, currentBillInfo).then(({ code, message }) => {
    if (code === 0) {
      if (url) browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/${ url }`)
    } else {
      Toast.fail(message, 1)
    }
    handleContainerClose()
  })
}

//  新编辑家庭页面接口
export const newEditHome = (currentBillInfo, url = '') => dispatch => {   // res是一个数组，第一个是userCategory，第二个是currentOrg
  const handleContainerClose = Loading()
  const customerUserId = sessionStorage.customerUserId
  currentBillInfo.userId = customerUserId
  send('/shenghuojiaofei/v2/user/update/info', currentBillInfo).then(({ code, message }) => {
    if (code === 0) {
      // 如果是要回到homeManege页面，就执行返回到上一页的命令
      if (url === 'homeManege') {
        dispatch({ type: 'CHANGE_HOME_TAG', currentHomeTag: currentBillInfo.tag })
        dispatch({ type: 'GET_USER_PAGE', userCategory: '' })
        window.history.go(-1)
        handleContainerClose()
        return
      }
      // 还会跳转到billInfo页面
      if (url) browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/${ url }`)
    } else {
      Toast.fail(message, 1)
    }
    handleContainerClose()
  })
}
//  新建用户接口
export const newUserPage = (currentBillInfo, tag, url = '') => dispatch => {
  const handleContainerClose = Loading()
  const customerUserId = sessionStorage.customerUserId
  currentBillInfo.userId = customerUserId
  currentBillInfo.channel = 'chinaums'
  send('/shenghuojiaofei/v2/user/info', currentBillInfo).then(({ code, data, message }) => {
    if (code === 0) {
      removeStore('newUserPage', 'session')
      let bill = { }
      data.userCategory.forEach(item => {
        if (item.tid === currentBillInfo.tid || item.tag === currentBillInfo.tag) {
          if (item.tagInfo.length > 0) bill = item.tagInfo[0]
          bill.tid = item.tid
        }
      })
      currentBillInfo = merge(currentBillInfo, bill)
      setStore('currentBillInfo', { currentBillInfo }, 'session')
      // 将新的userCategory数据保存下来
      dispatch({ type: 'GET_USER_PAGE', userCategory: data.userCategory })
      browserHistory.push(`/shenghuojiaofei/${ getStore('currentCategoryName', 'session').currentCategoryName }/${ url }`)
    } else {
      Toast.fail(message, 1)
    }
    handleContainerClose()
  })
}
