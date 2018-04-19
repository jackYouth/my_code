import React from 'react'
import { Empty } from '@boluome/oto_saas_web_app_component'
import { Icon } from 'antd-mobile'

import SellPrice from '../common-component/sell-price'

import '../../styles/user-center/collect-list.scss'

const CollectList = ({ collectList, handleCancelCollect, handleCommdityClick }) => {
  if (!collectList) return <div />
  return (
    <div className='collect-list-container'>
      <ul className='collect-list'>
        {
          collectList.length === 0 &&
          <Empty message='没找到服务和品牌' imgUrl={ require('../../img/no_commodity.png') } style={{ background: '#f5f5f6', height: 'calc(100% - 1rem)' }} />
        }
        {
          collectList.length >= 1 &&
          collectList.map(o => <CollectItem handleCancelCollect={ handleCancelCollect } handleCommdityClick={ handleCommdityClick } data={ o } key={ o.commodityId } />)
        }
      </ul>
    </div>
  )
}

export default CollectList


class CollectItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showDel: false,
    }
  }
  handleIconClick(e, showDel) {
    e.stopPropagation()
    this.setState({ showDel })
  }
  render() {
    const { data, handleCancelCollect, handleCommdityClick } = this.props
    const { banners, commodityDescription, commodityName, commodityId, maxSellPrice, sellPrice } = data
    const { showDel } = this.state
    return (
      <li className={ showDel ? 'active collect-item' : 'collect-item' }>
        <p onClick={ () => handleCommdityClick(commodityId) } className='collect-item-left'><img src={ banners[0] } alt={ commodityName } /></p>
        <div className='collect-item-mid' onClick={ () => handleCommdityClick(commodityId) }>
          <p className='collect-item-mid-top'>
            <span>{ `${ commodityName } ${ commodityDescription }` }</span>
          </p>
          <div className='collect-item-mid-bottom'>
            <SellPrice className='collect-item-mid-bottom' sellPrice={ sellPrice } maxSellPrice={ maxSellPrice } />
            <Icon onClick={ e => this.handleIconClick(e, !showDel) } type={ require('svg/shangcheng/more_ad.svg') } size='md' />
          </div>
        </div>
        <p className='collect-item-right line-1' onClick={ () => handleCancelCollect(commodityId) }>删除</p>
      </li>
    )
  }
}
