import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Toast } from 'antd-mobile'
import { setStore, getStore } from '@boluome/common-lib'
import { wrap, Mask } from '@boluome/oto_saas_web_app_component'
import { login } from 'business'

import { DetailsListData, DetailsListFn, DetailsIntroducedFn } from '../actions/details.js'
import { OrderDataList, GetTouristList } from '../actions/order.js'
// import { OtimeToast } from '../components/details.js'
import Details from '../components/details'

const mapStateToProps = ({ details }) => {
  // console.log('menpiao-------', details)
  const { DetailsListDatas, DetailsList, DetailsIntroduced, close } = details
  return {
    DetailsListDatas,
    DetailsListData,
    DetailsList,
    DetailsListFn,
    DetailsIntroduced,
    DetailsIntroducedFn,
    close,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    handlePicShow: data => {
      dispatch({
        type:         'CHOOSE_IMGINDEX',
        PicshowIndex: 0,
      })
      dispatch({
        type:        'KJIN_PICSHOWDATA',
        PicshowData: data,
      })
      dispatch({
        type:   'ISORNO_SHOWPIC',
        isorno: 1,
      })
      browserHistory.push('/menpiao/picshow')
      // window.location.href = '/menpiao/picshow'
    },
    handleGoOrder: (id, prices) => {
      setStore('goOrderId', id, 'session')
      dispatch(OrderDataList())
      dispatch(GetTouristList())
      setStore('countPrice', prices, 'session')
      setStore('chooseTime', '', 'session')
      const goodsCardata = []
      setStore('goodsCardata', goodsCardata, 'session')
      setStore('menpiao_email', '', 'session')
      const customerUserId = getStore('customerUserId', 'session')
      if (!customerUserId) {
        login(err => {
          if (err) {
            console.log(err)
            Toast.info('用户登录失败，请重新登录', 2, null, false)
          } else {
            console.log('我是用户绑定')
            browserHistory.push('/menpiao/order')
          }
        }, true)
      } else {
        browserHistory.push('/menpiao/order')
      }
    },
    handleGoaddrMap: (res, latitude, longitude) => {
      // console.log('asasas', latitude, longitude)
      const myaddrPoint = { latitude, longitude }
      setStore('goodsNameAddr', res, 'session')
      setStore('myaddrPoint', myaddrPoint, 'session')
      browserHistory.push('/menpiao/addrBumap?boluomeBmap')
      // window.location.href = '/menpiao/addrBumap?boluomeBmap'
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    dispatch(DetailsListData())
    dispatch(DetailsListFn())
    dispatch(DetailsIntroducedFn())
    dispatch({ type: 'MARKE_CLOSE', close: 0 })
  },
  // 组件将被消除的周期
  componentWillUnmount: () => {
    dispatch({ type: 'KJIN_DETAILSLISTDATA', DetailsListDatas: '' })
    dispatch({ type: 'MARKE_CLOSE', close: 1 })
    Mask.closeAll()
    const num = document.getElementsByClassName('mask-container').length
    for (let i = 0; i < num; i++) {
      document.getElementsByClassName('mask-container')[0].parentNode.remove()
    }
  },
})

export default
  connect(mapStateToProps, mapDispatchToProps)(
    wrap(mapFunToComponent)(Details)
)
