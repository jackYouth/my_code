import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Popup, Toast } from 'antd-mobile'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { setStore, getStore } from '@boluome/common-lib'
import App from '../components/app'
import { indexDatalist } from '../actions/index'
import addGoodsCartFns from '../components/addGoodsCartFns'

console.log('addGoodsCartFns---', addGoodsCartFns)

const mapStateToProps = state => {
  // console.log('state---', state)
  const { app } = state
  const { goodslist, tagsmark, markPopup, goodsCartarr } = app
  return {
    goodslist,
    tagsmark,
    markPopup,
    goodsCartarr,
  }
}

const mapDispatchToProps = dispatch => {
  // 整理一个兼容有无规格的购物车数组
  // const addGoodsCartFn = (datas, num, standard, sPrice) => {
  //   console.log(datas)
  //   const goods = {}
  //   goods.data = datas
  //   goods.quantity = num
  //   goods.standard = standard
  //   goods.markId = standard.length === 0 ? (datas.productId) : (datas.productId + standard.map(i => { return i.name + i.value + i.price }).join(''))
  //   // goods.oprice = sPrice === 0 ? datas.price : sPrice
  //   goods.oprice = sPrice === 0 ? datas.price : (datas.price + sPrice) * 1
  //   const goodsCartarr = getStore('goodsCartarr', 'session')
  //   console.log('goods---', goods, standard.map(i => { return i.name + i.value + i.price }).join(''))
  //   if (goodsCartarr.length > 0) {
  //     const cartArr = goodsCartarr.filter(item => {
  //       return (item.markId) === (goods.markId)
  //     })
  //     console.log('cartArr----', cartArr)
  //     if (cartArr.length > 0) {
  //       const cartStan = cartArr[0].standard
  //       cartArr[0].quantity += goods.quantity
  //       console.log(cartStan)
  //     } else {
  //       goodsCartarr.push(goods)
  //     }
  //   } else {
  //     goodsCartarr.push(goods)
  //   }
  //   setStore('goodsCartarr', goodsCartarr, 'session')
  //   dispatch({ type: 'GOODS_CARTARR', goodsCartarr })
  //   console.log('goodsCartarr----', getStore('goodsCartarr', 'session'))
  // }
  const callback = data => {
    dispatch({ type: 'GOODS_CARTARR', goodsCartarr: data })
  }
  return {
    dispatch,
    // 选择tags，即改变商品类别
    handleTagsMark: item => {
      dispatch({ type: 'KJIN_GOODSLIST', tagsmark: item })
    },
    // 没有规格的添加到购物车
    addCartFn: (yesOrno, data, standard, sum) => {
      if (yesOrno === 'no') { // 当没有规格时
        console.log('没有规格', data)
        const num = 1
        standard = []
        console.log('call----', callback)
        addGoodsCartFns(data, num, standard, 0, callback)
      } else if (yesOrno === 'yes') { // 这里是有规格
        console.log('有规格', data, standard)
        let sPrice = 0
        standard.map(item => (
          sPrice += item.price
        ))
        console.log('sPrice---', sPrice)
        addGoodsCartFns(data, sum, standard, sPrice, callback)
      } else if (yesOrno === 'both') { // 这里是清除购物车的时候
        console.log('清空购物车', data)
      }
    },
    // 没有规格的减少购物车里的数量
    ReduceCartNum: data => {
      console.log('ReduceCartNum----', data)
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
    ReduceCartListNum: data => {
      console.log(data)
      Toast.info('多规格请到购物车里减少', 1)
    },
    handleReduceNum: (markId, number) => {
      console.log('handleReduceNum---', markId, number)
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
    // goContactList: () => {
    //   browserHistory.push('/coffee/contactlist')
    // },
    goDetailsShow: product => {
      setStore('ChooseGoods', product, 'session')
      browserHistory.push(`/coffee/details?productId=${ product.productId }`)
    },
    goOrderMmessage: () => {
      Popup.hide()
      browserHistory.push('/coffee/order')
    },
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    // dispatch(indexDatalist())
  },
  componentDidMount: () => {
    dispatch(indexDatalist())
    const goodsCartarr = getStore('goodsCartarr', 'session')
    if (goodsCartarr) {
      console.log('购物车不为空')
      dispatch({ type: 'GOODS_CARTARR', goodsCartarr })
    } else {
      setStore('goodsCartarr', [], 'session')
    }
  },
  componentWillUnmount() {
    Popup.hide()
    console.log('componentWillUnmount--app---', dispatch)
  },
  // componentWillReceiveProps(nextProps) {
  //   console.log('nextProps---', nextProps)
  //   // dispatch({ type: 'GOODS_CARTARR', goodsCartarr: nextProps.goodsCartarr })
  // },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(App)
)
