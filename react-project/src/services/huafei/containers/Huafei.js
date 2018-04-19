//   引入react创建组件，connect为组件注入属性，方法，wrap方法为组件注入生命周期,子组件Huafei
import { connect } from  'react-redux'
import { getStore, removeStore, setStore } from '@boluome/common-lib'
import { wrap, Loading } from '@boluome/oto_saas_web_app_component'
import { login } from 'business'
import { Toast } from 'antd-mobile'

import Huafei from '../components/Huafei.js'
import { queryHuafeiList, changeSubmit } from '../actions/huafei.js'


const mapStateToProps = state => {
  const { huafei } = state
  const phoneHistorys = getStore('phoneHistorys') ? getStore('phoneHistorys').phoneHistorys : []
  return {
    ...huafei,
    phoneHistorys,
  }
}

const clearPhone = () => dispatch => {
  dispatch({ type: 'SET_CURPHONE', curPhone: '' })
  dispatch({ type: 'SET_NUMBER_INFO', hfInfo: '' })               // 清除store中的hfInfo，使提交按钮和话费列表恢复初始情况
  dispatch({ type: 'SHOW_HISTORY', visibilityHistory: 'true' })  //   显示号码历史记录
  dispatch({ type: 'SET_IPT_CLICK', isFirstIptClick: false })
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handleHfClick: (selectedHf, curPhone) => {
      dispatch({ type: 'SELECTED_HF', selectedHf })
      if (!selectedHf) {  // 当输入手机号码错误时
        if (curPhone.length === 0 || !curPhone) {
          Toast.fail('请先输入手机号码', 1)
        } else if (curPhone.length < 13) {
          Toast.fail('请输入完整的手机号码', 1)
        } else if (curPhone.length === 13) {  // 当输入手机号码完整
          Toast.fail('请输入正确的手机号码', 1)
        }
      }
    },
    handleClear() { dispatch({ type: 'SET_CURPHONE', curPhone: '' }) },
    handleIptChange: (content, prePhone) => {
      if (prePhone && prePhone.length === 13 && content && content.length === 13) return
      dispatch({ type: 'SHOW_HISTORY', visibilityHistory: 'true' })
      dispatch(queryHuafeiList(content))
    },
    handlePhoneHistory: curPhone => {
      dispatch({ type: 'SET_CURPHONE', curPhone, visibilityHistory: '' })
      dispatch(queryHuafeiList(curPhone))
    },
    handleSubmit: (selectedHf, isSubmit, curPhone, resultPrice, activityId, couponId) => {
      if (isSubmit) {
        //   将充值历史记录放倒store中
        changeSubmit(selectedHf, resultPrice, activityId, couponId)
      } else if (!curPhone || curPhone.length === 0) {
        Toast.fail('请先输入手机号码', 1)
      } else if (curPhone.length < 13) {
        Toast.fail('请输入完整的手机号码', 1)
      } else if (curPhone.length === 13) {  //   当输入手机号码完整
        Toast.fail('请输入正确的手机号码', 1)
      }
    },
    handleClearHistory: () => {
      dispatch({ type: 'PHONE_HISTORY', phoneHistorys: [] })
      removeStore('phoneHistorys')
    },
    handleClearPhone: () => {
      dispatch(clearPhone())
    },
    handleIptClick: () => {
      dispatch(clearPhone())
      dispatch({ type: 'SET_IPT_CLICK', isFirstIptClick: false })
    },
    changeFocus: curPhone => {
      dispatch({ type: 'SET_FOCUS_CONDITION', isFocus: true })
      if (curPhone.length !== 13) {
        dispatch({ type: 'SHOW_HISTORY', visibilityHistory: true })
      }
    },
    changeBlur: () => {
      dispatch({ type: 'SET_FOCUS_CONDITION', isFocus: false })
      dispatch({ type: 'SHOW_HISTORY', visibilityHistory: '' })
    },
    handlePromotionChange: curDiscountData => dispatch({ type: 'SET_CURRENT_DISCOUNT', curDiscountData }),
  }
}


const mapFuncToComponent = dispatch => {
  return {
    componentDidMount() {
      // 改变font-size和scale的值
      document.documentElement.style.fontSize = '13.33vw'

      // 获取配置中的noCustomerUserPhone
      const { OTO_SAAS = {} } = window
      const { customer = {} } = OTO_SAAS
      const { noCustomerUserPhone = false } = customer
      setStore('noCustomerUserPhone', noCustomerUserPhone, 'session')

      if (location.pathname.indexOf('chongzhi') < 0) {
        const closeLoading = Loading()
        const myLogin = () => login((err, { userPhone }) => {       //   登陆
          if (err) {
            setTimeout(myLogin, 3000)
            return
          }
          closeLoading()
          // 如果客户没有传userPhone过来，就不执行将userPhone作为默认充值号码的操作
          if (noCustomerUserPhone) {
            return
          }
          const phoneHistorys = getStore('phoneHistory') ? getStore('phoneHistory').phoneHistorys : []
          dispatch({ type: 'PHONE_HISTORY', phoneHistorys })
          userPhone = `${ userPhone.substr(0, 3) } ${ userPhone.substr(3, 4) } ${ userPhone.substr(7, 4) }`
          dispatch(queryHuafeiList(userPhone))
        })
        myLogin()
      } else if (!sessionStorage.customerUserId || (!sessionStorage.customerUserId && !noCustomerUserPhone)) {   //   是充值项目，且未登陆，执行获取用户配置、登陆命令
        const closeLoading = Loading()
        const myLogin = () => login((err, { userPhone }) => {  //   登陆           //   need_change
          if (err) {
            setTimeout(myLogin, 3000)
            return
          }
          closeLoading()
          const phoneHistorys = getStore('phoneHistory') ? getStore('phoneHistory').phoneHistorys : []
          dispatch({ type: 'PHONE_HISTORY', phoneHistorys })
          // 如果客户没有传userPhone过来，就不执行将userPhone作为默认充值号码的操作
          if (noCustomerUserPhone) {
            return
          }
          userPhone = `${ userPhone.substr(0, 3) } ${ userPhone.substr(3, 4) } ${ userPhone.substr(7, 4) }`
          dispatch(queryHuafeiList(userPhone))
        })
        myLogin()
      } else {  //   当不是第一次进入话费时，就使用流量切过来时带的号码
        const chongzhiPhone = getStore('chongzhiPhone', 'session') ? getStore('chongzhiPhone', 'session') : ''
        if (chongzhiPhone.length === 13) {
          dispatch(queryHuafeiList(chongzhiPhone))
        }
        dispatch({ type: 'SET_CURPHONE', curPhone: chongzhiPhone })       //   将当前的输入框中内容合并到huafei分支中
        const phoneHistorys = getStore('phoneHistory') ? getStore('phoneHistory').phoneHistorys : []
        dispatch({ type: 'PHONE_HISTORY', phoneHistorys })
      }
    },

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(wrap(mapFuncToComponent)(Huafei))
