import { setStore, getStore } from '@boluome/common-lib'
import { Loading } from '@boluome/oto_saas_web_app_component'
import { Toast } from 'antd-mobile'
import { get, send, afterOrdering } from 'business'

// 定义一个函数用去除空格
const phoneTrim = phone => {
  const phoneREP = /^(\d{3})[\s](\d{4})[\s](\d{4})$/
  const matches = phoneREP.exec(phone)
  if (matches) {
    const newNum = matches[1] + matches[2] + matches[3]
    return newNum
  }
  return false
}

export const queryLiuliangList = content => dispatch => {
  const sPhone = phoneTrim(content)
  dispatch({ type: 'SET_LL_CURPHONE', curPhone: content })  // 将当前的输入框中内容合并到Liuliang分支中
  dispatch({ type: 'SET_LL_FOCUS_CONDITION', isFocus: true })    // 改变字体颜色
  dispatch({ type: 'SELECTED_LL', selectedHf: { index: '', list: ['', '', '', '', '', ''] } })        // 清空当前选中的信息
  if (content.length === 13) {
    const closeLoading = Loading()  // 开启一个loading图
    get(`/liuliang/v1/${ sPhone }/prices`, { channel: 'dhst' }).then(({ code, data, message }) => {
      if (code === 0) {
        data.number = content
        dispatch({ type: 'SET_LL_NUMBER_INFO', hfInfo: data }) // 将当前选中的栏目信息合并到Liuliang分支中
        dispatch({ type: 'SHOW_LL_HISTORY', visibilityHistory: '' }) // 隐藏历史记录
        dispatch({ type: 'SET_LL_FOCUS_CONDITION', isFocus: false })    // 改变字体颜色
        closeLoading() // 关闭loading图
      } else {
        dispatch({ type: 'SET_LL_NUMBER_INFO', hfInfo: '' })
        closeLoading() // 关闭loading图
        Toast.fail(message, 1)
        document.activeElement.blur()
      }
    }).catch(({ message }) => {
      closeLoading() // 关闭loading图
      console.log(message)
    })
  } else if (content.length === 0) {
    dispatch({ type: 'SET_LL_NUMBER_INFO', hfInfo: '' })    // 清除store中的hfInfo，使提交按钮和话费列表恢复初始情况
  } else {
    dispatch({ type: 'SET_LL_NUMBER_INFO', hfInfo: '' })    // 清除store中的hfInfo，使提交按钮和话费列表恢复初始情况
  }
}


export const changeSubmit = (selectedHf, resultPrice, activityId, couponId) => {
  const { number, list, isp, area } = selectedHf
  const userId    = sessionStorage.customerUserId
  const phone = phoneTrim(number)
  // 从客户配置文件中看是否有手机号传过来，如果没有，就使用充值的手机号码，作为默认手机号码
  const noCustomerUserPhone = getStore('noCustomerUserPhone', 'session')
  let userPhone
  if (noCustomerUserPhone === true) {
    userPhone = phone
  } else {
    userPhone = getStore('userPhone', 'session')
  }
  // const userPhone = getStore('userPhone', 'session') || phone
  const paras = {
    customerUserId: userId,
    customerId:     userId,
    flow:           list.flow,
    channel:        'dhst',
    phone,
    couponId,
    activityId,
    userPhone,
    isp,
    area,
  }

  /* **************以下是把当前充值号码保存到本地中************** */
  const phoneHistorys = getStore('phoneHistorys') ? getStore('phoneHistorys').phoneHistorys : []
  phoneHistorys.filter(item => item !== selectedHf.number)  // 过滤掉当前历史中和当前号码相同的号码，再将当前号码插进去
  let exist = true
  for (let i = 0; i < phoneHistorys.length; i++) {
    if (phoneHistorys[i] === selectedHf.number) {
      exist = false
    }
  }
  if (exist) phoneHistorys.unshift(selectedHf.number)
  setStore('phoneHistorys', { phoneHistorys })
  /* **************以上是把当前充值号码保存到本地中************** */

  const closeLoading = Loading()  // 开启一个loading图
  send('/liuliang/v1/order', paras, 'POST', { 'Content-Type': 'application/json' }).then(({ code, data, message }) => {
    if (code === 0) {
      afterOrdering(data)
      setTimeout(closeLoading, 1000)
    } else {
      closeLoading()       // 关闭loading图
      Toast.fail(message, 1)
    }
  }).catch(({ message }) => {
    closeLoading()          // 关闭loading图
    console.log(message)
  })
}
