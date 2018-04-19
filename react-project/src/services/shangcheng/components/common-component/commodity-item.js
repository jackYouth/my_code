import React from 'react'
import { browserHistory } from 'react-router'
import { Icon } from 'antd-mobile'

import '../../styles/comment-component/commodity-item.scss'

const CommodityItem = ({ data, onClick, showCart = false, handleAddCommodity, isDaojia }) => {
  const { banners, commodityName, commodityDescription, sellPrice, maxSellPrice, originalPrice, purchasesCount, goodComment, industryCode, serviceId, isCanService, unitName } = data
  return (
    <li className='commodity-item' onClick={ () => {
      if (onClick) {
        onClick(data)
        return
      }
      if (!isDaojia) browserHistory.push(`/shangcheng/commodity?commodityId=${ data.commodityId }`)
      if (isDaojia) {
        location.href = `${ location.origin }/daojia/${ industryCode }/detail?serviceId=${ serviceId }&supportThisCity=${ isCanService }`
      }
    } }
    >
      <div className='commodity-item-left'>
        <img src={ banners[0] } alt={ commodityName } />
      </div>
      <div className='commodity-item-right'>
        <p className='commodity-item-top line-2'>{ `${ commodityName } ${ commodityDescription }` }</p>
        <p className='commodity-item-bottom'>
          {
            maxSellPrice ?
              <span className='commodity-item-price'>
                ¥
                <span>{ sellPrice }</span>
                &nbsp;~ ¥
                <span>{ maxSellPrice }</span>
                { unitName ? `/${ unitName }` : '' }
              </span> :
              <span className='commodity-item-price'>
                ¥
                <span>{ sellPrice }</span>
                { unitName ? `/${ unitName }` : '' }
              </span>
          }
          {
            Boolean(originalPrice) &&
            <del className='commodity-item-original-price'>{ ` ¥${ originalPrice }` }</del>
          }
          <span className='commodity-item-purchases-count'>{ `${ purchasesCount }人付款` }</span>
          {
            Boolean(showCart) &&
            <Icon className='commodity-item-cart-icon' type={ require('svg/shangcheng/cart_theme.svg') } size='md' onClick={ e => { e.stopPropagation(); handleAddCommodity(data) } } />
          }
          {
            isDaojia && Boolean(goodComment) &&
            <span className='commodity-item-purchases-count'>{ `好评数：${ goodComment }` }</span>
          }
        </p>
      </div>
    </li>
  )
}

export default CommodityItem


// class ChangeCommodityCount extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       count: 1,
//     }
//   }
//   componentWillReceiveProps(nextProps) {
//     const { count } = nextProps
//     const preCount = this.state.count
//     if (count !== preCount) this.setState({ count })
//   }
//   handleAddClick(count) {
//     const { handleChangeCount } = this.props
//     count++
//     handleChangeCount(count)
//   }
//   handleSubClick(count) {
//     const { handleChangeCount } = this.props
//     count--
//     handleChangeCount(count)
//   }
//   render() {
//     const { count } = this.state
//     const { maxQuantity, minQuantity } = this.props
//     return (
//       <div className='change-commodity-count commodity-count'>
//         <Icon onClick={ count <= minQuantity ? '' : () => this.handleSubClick(count) } type={ count <= minQuantity ? require('svg/daojia/sub_disable.svg') : require('svg/daojia/sub.svg') } size='md' />
//         <span>&nbsp;{ count }&nbsp;</span>
//         <Icon onClick={ count >= maxQuantity ? '' : () => this.handleAddClick(count) } type={ count >= maxQuantity ? require('svg/daojia/add_disable.svg') : require('svg/daojia/add.svg') } size='md' />
//       </div>
//     )
//   }
// }
