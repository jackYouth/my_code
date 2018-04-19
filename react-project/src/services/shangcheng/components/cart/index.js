import React from 'react'
import { Empty } from '@boluome/oto_saas_web_app_component'

import CartBrandItem from './cart-brand-item'

import '../../styles/cart/index.scss'

// statusChecked ：购物城中的商品状态是否检测过
const Cart = ({ cartCommoditys, handleChangeCommdity, statusChecked }) => {
  if (!cartCommoditys) return <div />
  // 因为考虑到CartBrandItem中，commodityList中使用的是constructor中第一次直接取出来放入orderCommoditys中，所以如果CartBrandItem更新orderCommoditys并不会更新，
  // 又因为cartCommoditys是全局app对象下的，所以第一次进入，肯定会有，所以必须用这个判断
  // 所以需要专门定义了一个字段: statusChecked，用于判断什么时候会更新完毕
  if (!statusChecked) return <div />
  const { totalNum, brandList } = cartCommoditys
  return (
    <div className='cart'>
      {
        totalNum === 0 &&
        <Empty imgUrl={ require('../../img/no_cart.png') } title='购物车竟然是空的' message='“再忙，也要记得买点什么犒赏自己～”' />
      }
      {
        totalNum !== 0 && brandList.length > 0 &&
        <ul className='cart-brand-list'>
          {
            brandList.map((o, i) => <CartBrandItem { ...{ cartCommoditys, handleChangeCommdity } } brandIndex={ i } data={ o } key={ o.brandId } />)
          }
        </ul>
      }
    </div>
  )
}

export default Cart
