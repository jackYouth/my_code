import React from 'react'
// import { Icon } from 'antd-mobile'
import CartListCom from './cart.js'
import ListAddDown from './listadddown.js'
import '../style/details.scss'

const Details = props => {
  const { ChooseGoods,
    goOrderMmessage, handleOnClose,
    goodsCartarr, handleReduceNum, addCartFn, ReduceCartNum, ReduceCartListNum,
  } = props
  return (
    <div className='detailsWrap'>
      <div className='detailsMian'>
        {
          ChooseGoods ? (
            <div>
              <img alt='' src={ ChooseGoods.largePhotoUrl } />
              <DetailsShow ChooseGoods={ ChooseGoods }
                goodsCartarr={ goodsCartarr }
                addCartFn={ addCartFn }
                ReduceCartNum={ ReduceCartNum }
                ReduceCartListNum={ ReduceCartListNum }
              />
            </div>
          ) : (
            <div />
          )
        }
      </div>
      <div className='footerCart'>
        <CartListCom onChange={ goOrderMmessage }
          goodsCartarr={ goodsCartarr }
          handleReduceNum={ handleReduceNum }
          handleOnClose={ handleOnClose }
        />
      </div>
    </div>
  )
}

const DetailsShow = ({ ChooseGoods, goodsCartarr, addCartFn, ReduceCartNum, ReduceCartListNum }) => {
  const { description, price, productId, productName, attribute } = ChooseGoods
  const tipsText = '加入购物车'
  return (
    <div className='details'>
      <div className='title'>
        <span>{ productName }</span>
        {
          attribute ? (<span className='attribute'>多规格</span>) : ('')
        }
      </div>
      <div className='price'>
        <span className='price_l'>¥ </span>
        <span className='price_c'> { price }</span>
        <ListAddDown
          productId={ productId }
          goodsCartarr={ goodsCartarr }
          data={ ChooseGoods }
          addCartFn={ addCartFn }
          ReduceCartNum={ ReduceCartNum }
          ReduceCartListNum={ ReduceCartListNum }
          tipsText={ tipsText }
        />
      </div>
      <div className='description'>{ description }</div>
    </div>
  )
}
export default Details
