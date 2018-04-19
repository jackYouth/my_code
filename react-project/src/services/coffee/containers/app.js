import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Popup, Toast } from 'antd-mobile'
import { setStore, getStore } from '@boluome/common-lib'
import { wrap, Mask, Loading } from '@boluome/oto_saas_web_app_component'
import { login, getLocationGaode } from 'business' // getLocation,
import App from '../components/app'
import { indexDatalist, getOptimalContact, getContactList } from '../actions/index'
import addGoodsCartFns from '../components/addGoodsCartFns'

// console.log('addGoodsCartFns---', addGoodsCartFns)

const mapStateToProps = state => {
  // console.log('state---', state)
  const { app } = state
  return {
    ...app,
  }
}

const mapDispatchToProps = dispatch => {
  // 在添加到购物车方法里面的公共部分
  const callback = data => {
    // console.log('call')
    dispatch({ type: 'GOODS_CARTARR', goodsCartarr: data })
  }
  return {
    dispatch,
    // 测试首页需要的订单详情页面的入口
    goOrderDetails: () => {
      browserHistory.push('/coffee/orderDetails')
    },
    // 没有规格的添加到购物车
    addCartFn: (yesOrno, data, standard, sum) => {
      if (yesOrno === 'no') { // 当没有规格时
        // console.log('没有规格', data)
        const num = 1
        standard = []
        addGoodsCartFns(data, num, standard, 0, callback)
      } else if (yesOrno === 'yes') { // 这里是有规格
        // console.log('有规格', data, standard)
        let sPrice = 0
        standard.map(item => (
          sPrice += item.price
        ))
        addGoodsCartFns(data, sum, standard, sPrice, callback)
      } else if (yesOrno === 'both') { // 这里是清除购物车的时候
        console.log('清空购物车', data)
      }
    },
    // 没有规格的减少购物车里的数量
    ReduceCartNum: data => {
      // console.log('ReduceCartNum----', data)
      const goodsCartarr = getStore('goodsCartarr', 'session')
      for (let t = 0; t < goodsCartarr.length; t++) {
        if (goodsCartarr[t].data.productId === data.productId) {
          if (goodsCartarr[t].quantity > 1) {
            goodsCartarr[t].quantity--
          } else {
            goodsCartarr.splice(t, 1)
          }
        }
      }
      setStore('goodsCartarr', goodsCartarr, 'session')
      dispatch({ type: 'GOODS_CARTARR', goodsCartarr })
    },
    // 有规格的商品的数量减少
    ReduceCartListNum: () => {
      // console.log(data)
      Toast.info('多规格请到购物车里减少', 1)
    },
    // 这个是购物车列表展示的时候加减组件
    handleReduceNum: (markId, number) => {
      // console.log('handleReduceNum---', markId, number)
      const goodsCartarr = getStore('goodsCartarr', 'session')
      for (let j = 0; j < goodsCartarr.length; j++) {
        if (goodsCartarr[j].markId === markId) {
          goodsCartarr[j].quantity += number
          if (goodsCartarr[j].quantity === 0) {
            goodsCartarr.splice(j, 1)
          }
        }
      }
      setStore('goodsCartarr', goodsCartarr, 'session')
      dispatch({ type: 'GOODS_CARTARR', goodsCartarr })
      return goodsCartarr
      // 这里是解决Popup 组件购物车的实时更新
    },
    // 清空购物车，需要传给组件的事件
    handleOnClose: () => {
      setStore('goodsCartarr', [], 'session')
      dispatch({ type: 'GOODS_CARTARR', goodsCartarr: [] })
      Popup.hide()
    },
    // 这个是跳出收货地址列表让他选择，主要出现在点击添加到购物车
    handleChangeContact: (contact, handleContainerClose) => {
      const { latitude, longitude } = contact
      Loading()
      dispatch({
        type:           'KJIN_OPTIMALCONTACT',
        OptimalContact: contact,
        userPoint:      { latitude, longitude },
      })
      setStore('coffee_loading', false, 'session')
      setStore('coffee_contact', contact, 'session')
      if (contact) {
        dispatch(indexDatalist({ latitude, longitude }))
      }
      dispatch({ type: 'TITLE_ADDRESS', titleAddress: contact.detail })
      Mask.closeAll()
      handleContainerClose()
    },
    handleBtnEvevtR: () => {
      getLocationGaode(err => {
        if (err) {
          dispatch({ type: 'NOLOCATION', nolocation: false })
        } else {
          dispatch({ type: 'NOLOCATION', nolocation: true })
          const latOrlng = getStore('geopoint', 'session')
          dispatch(getOptimalContact(latOrlng))
        }
      })
    },
    goDetailsShow: product => {
      setStore('ChooseGoods', product, 'session')
      browserHistory.push(`/coffee/details?productId=${ product.productId }`)
    },
    goOrderMmessage: () => {
      Popup.hide()
      browserHistory.push('/coffee/order')
    },
    goContactList: () => {
      dispatch({ type: 'NOLOCATION', nolocation: true })
      browserHistory.push('/coffee/contactlist')
    },
    // 当选择了收货地址之后的事件
    handleChooseContact(contact) {
      if (contact) {
        dispatch({ type: 'NOLOCATION', nolocation: true })
        const latOrlng = { latitude: contact.latitude, longitude: contact.longitude }
        dispatch({
          type:           'KJIN_OPTIMALCONTACT',
          OptimalContact: contact,
          userPoint:      latOrlng,
        })
        dispatch(indexDatalist(latOrlng))
        dispatch({ type: 'TITLE_ADDRESS', titleAddress: contact.detail })
        setStore('coffee_contact', contact, 'session')
        console.log('----test-----ssss-', contact)
      } else {
        const latOrlng = getStore('geopoint', 'session')
        const currentPosition = getStore('currentPosition', 'session')
        dispatch({
          type:           'KJIN_OPTIMALCONTACT',
          OptimalContact: '',
          userPoint:      latOrlng,
        })
        if (latOrlng) {
          dispatch(indexDatalist(latOrlng))
          dispatch({ type: 'TITLE_ADDRESS', titleAddress: `${ currentPosition.street + currentPosition.streetNumber }` })
        }
      }
      dispatch({ type: 'GOODS_CARTARR', goodsCartarr: [] })
      setStore('goodsCartarr', [], 'session')
      // const node = document.getElementsByClassName('mask-container')
      // if (node.length > 0) {
      //   node[0].remove()
      // }
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
        dispatch(getContactList())
      }
    })
    // 如果是选择收货地址在这里处理事件
    const contact = getStore('coffee_contact', 'session')
    if (contact) {
      console.log('我是收货地址', contact)
      const latOrlng = { latitude: contact.latitude, longitude: contact.longitude }
      dispatch({
        type:           'KJIN_OPTIMALCONTACT',
        OptimalContact: contact,
        userPoint:      latOrlng,
      })
      dispatch(indexDatalist(latOrlng))
      dispatch({ type: 'TITLE_ADDRESS', titleAddress: contact.detail })
      Mask.closeAll() // 2017-11-07 loading
    } else {
      getLocationGaode(err => {
        if (err) {
          console.log(err)
          dispatch({ type: 'NOLOCATION', nolocation: false })
          Mask.closeAll()
        } else {
          dispatch({ type: 'NOLOCATION', nolocation: true })
          const latOrlng = getStore('geopoint', 'session')
          const currentPosition = getStore('currentPosition', 'session')
          dispatch({ type: 'TITLE_ADDRESS', titleAddress: `${ currentPosition.street + currentPosition.streetNumber }` })
          dispatch(getOptimalContact(latOrlng))
        }
      })
    }
    setStore('scrollTop', 0, 'session')
    const tagsIndex = getStore('tagsIndex', 'session')
    if (tagsIndex) {
      dispatch({ type: 'TAGS_INDEX', tagsIndex })
    }
  },
  componentDidMount: () => {
    // dispatch(getContactList())
    const goodsCartarr = getStore('goodsCartarr', 'session')
    if (goodsCartarr) {
      dispatch({ type: 'GOODS_CARTARR', goodsCartarr })
    } else {
      setStore('goodsCartarr', [], 'session')
    }
  },
  componentWillUnmount() {
    const num = document.getElementsByClassName('mask-container').length
    for (let i = 0; i < num; i++) {
      document.getElementsByClassName('mask-container')[0].parentNode.remove()
    }
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
