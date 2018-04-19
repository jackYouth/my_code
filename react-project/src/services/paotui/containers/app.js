import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
// import { Toast } from 'antd-mobile'
import { getStore, setStore, stringifyQuery } from '@boluome/common-lib'
import { merge, compose, ifElse, equals, type, length, both, gt, __ } from 'ramda'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { getLocationGaode, login } from 'business' // login,
import App         from '../components/app'
import { getGoodsMessage } from '../actions/index'

const mapStateToProps = state => {
  const { app } = state
  const { quickItem, textareaStr, files, CUSTOMER } = app
  // console.log('app---', app)
  return {
    quickItem,
    textareaStr,
    files,
    CUSTOMER,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    goOrder: () => {
      // const textarea = document.querySelector('.text').value
      // setStore('paotui_textarea', textarea, 'session')
      setStore('paotui_productName', [], 'session')
      // dispatch({ type: 'TEATAREA', textareaStr: textarea })
      browserHistory.push('/paotui/order')
    },
    handleGoOrderList: () => {
      const customerUserId = getStore('customerUserId', 'session')
      const query          = compose(stringifyQuery, merge({ customerUserId }))(ifElse(both(compose(equals('String'), type), compose(gt(__, 0), length)))) // , always({ orderTypes }), always({}))(orderTypes)
      window.location.href = `/paotui/list${ query }`
    },
    // 返回的填入状态里面
    changeText: () => {
      const text = getStore('paotui_textarea', 'session')
      const file = getStore('paotui_imgSrc', 'session')
      dispatch({ type: 'TEATAREA', textareaStr: text })
      dispatch({ type: 'IMGSRC_FILES', files: file })
    },
    // 测试进入订单详情的入口
    GoOrderDetails: () => {
      browserHistory.push('/paotui/orderDetails')
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    login(err => {
      if (err) {
        console.log(err)
      } else {
        console.log('我是用户绑定')
      }
    })
    getLocationGaode(err => {
      if (err) {
        console.log('err', err)
      } else {
        console.log('success')
      }
    })
    dispatch(getGoodsMessage())
    const textareaStr = getStore('paotui_textarea', 'session')
    if (textareaStr) {
      dispatch({ type: 'TEATAREA', textareaStr })
    } else {
      dispatch({ type: 'TEATAREA', textareaStr: '' })
      setStore('paotui_textarea', '', 'session')
    }
    // 这里是判断哪些客户不需要用户中心
    console.log(window.OTO_SAAS)
    const CUSTOMER = (window.OTO_SAAS).customer.showUserCenter
    dispatch({ type: 'SAAS_CUSTOMER', CUSTOMER })
  },
  componentDidMount: () => {
    const files = getStore('paotui_imgSrc', 'session')
    if (files) {
      dispatch({ type: 'IMGSRC_FILES', files })
    } else {
      // 创建 files
      dispatch({ type: 'IMGSRC_FILES', files: [] })
      setStore('paotui_imgSrc', [], 'session')
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
