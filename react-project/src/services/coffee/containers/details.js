import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import { Popup, Toast } from 'antd-mobile'
import { wrap }    from '@boluome/oto_saas_web_app_component'
import { getStore, setStore } from '@boluome/common-lib'
import Details from '../components/details'
import addGoodsCartFns from '../components/addGoodsCartFns'

const mapStateToProps = state => {
  console.log('state---', state)
  const { details, app } = state
  const { ChooseGoods } = details
  const { goodsCartarr } = app
  return {
    ChooseGoods,
    goodsCartarr,
  }
}

const mapDispatchToProps = dispatch => {
  // 在添加到购物车方法里面的公共部分
  const callback = data => {
    dispatch({ type: 'GOODS_CARTARR', goodsCartarr: data })
  }
  return {
    dispatch,
    goOrderMmessage: () => {
      Popup.hide()
      browserHistory.push('/coffee/order')
    },
    // 选择tags，即改变商品类别
    handleTagsMark: item => {
      dispatch({ type: 'KJIN_GOODSLIST', tagsmark: item })
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
    ReduceCartListNum: data => {
      console.log(data)
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
  }
}

const mapFunToComponent  = dispatch => ({
  componentWillMount: () => {
    document.title = '商品详情'
    // dispatch(indexDatalist())
    const ChooseGoods = getStore('ChooseGoods', 'session')
    dispatch({ type: 'GOODSDETAILS', ChooseGoods })
  },
  componentDidMount: () => {
    const goodsCartarr = getStore('goodsCartarr', 'session')
    if (goodsCartarr) {
      console.log('购物车不为空')
      dispatch({ type: 'GOODS_CARTARR', goodsCartarr })
    } else {
      setStore('goodsCartarr', [], 'session')
    }
  },
  componentWillUnmount: () => {
    dispatch({ type: 'GOODSDETAILS', ChooseGoods: '' })
    Popup.hide()
  },
})

export default
connect(mapStateToProps, mapDispatchToProps)(
  wrap(mapFunToComponent)(Details)
)
