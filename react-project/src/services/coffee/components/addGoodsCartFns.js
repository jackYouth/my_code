import { setStore, getStore } from '@boluome/common-lib'

const addGoodsCartFns = (datas, num, standard, sPrice, callback) => {
  const goods = {}
  goods.data = datas
  goods.quantity = num
  goods.standard = standard
  goods.markId = standard.length === 0 ? (datas.productId) : (datas.productId + standard.map(i => { return i.name + i.value + i.price }).join(''))
  goods.oprice = sPrice === 0 ? datas.price : (datas.price + sPrice) * 1
  const goodsCartarr = getStore('goodsCartarr', 'session')
  // console.log('goods---', goods, standard.map(i => { return i.name + i.value + i.price }).join(''))
  if (goodsCartarr.length > 0) {
    const cartArr = goodsCartarr.filter(item => {
      return (item.markId) === (goods.markId)
    })
    if (cartArr.length > 0) {
      // const cartStan = cartArr[0].standard
      cartArr[0].quantity += goods.quantity
      // console.log(cartStan)
    } else {
      goodsCartarr.push(goods)
    }
  } else {
    goodsCartarr.push(goods)
  }
  setStore('goodsCartarr', goodsCartarr, 'session')
  callback(goodsCartarr)
  // dispatch({ type: 'GOODS_CARTARR', goodsCartarr })
}

export default (
  // string -> string -> string | object
  addGoodsCartFns
)

// export const f = () => {}
//
// import { f } from 'xxx'
//
//
//
// const f = () => {}
//
// const f2 = () => {}
//
// export default ({
//   f, f2
// })
//
// import f123 from 'xxx'
//
// const { f, f2 } = f123
