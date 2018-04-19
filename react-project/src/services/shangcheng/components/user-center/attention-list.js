import React from 'react'
import { Empty } from '@boluome/oto_saas_web_app_component'
import { Icon } from 'antd-mobile'

import '../../styles/user-center/attention-list.scss'

const AttentionList = ({ attentionList, handleCancelAttention, handleBrandClick }) => {
  if (!attentionList) return <div />
  return (
    <div className='attention-list-container'>
      <ul className='attention-list'>
        {
          attentionList.length === 0 &&
          <Empty message='没找到服务和品牌' imgUrl={ require('../../img/no_commodity.png') } style={{ background: '#f5f5f6', height: 'calc(100% - 1rem)' }} />
        }
        {
          attentionList.length >= 1 &&
          attentionList.map(o => <AttentionItem handleCancelAttention={ handleCancelAttention } handleBrandClick={ handleBrandClick } data={ o } key={ o.brandId } />)
        }
      </ul>
    </div>
  )
}

export default AttentionList


class AttentionItem extends React.Component {
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
    const { data, handleCancelAttention, handleBrandClick } = this.props
    const { bigLogoImg, brandName, brandId } = data
    const { showDel } = this.state
    return (
      <li className={ showDel ? 'active attention-item' : 'attention-item' }>
        <p onClick={ () => handleBrandClick(brandId) } className='attention-item-left'><img src={ bigLogoImg } alt={ brandName } /></p>
        <div onClick={ () => handleBrandClick(brandId) } className='attention-item-mid'>
          <span>{ `${ brandName }` }</span>
          <Icon onClick={ e => this.handleIconClick(e, !showDel) } type={ require('svg/shangcheng/more_ad.svg') } size='md' />
        </div>
        <p className='attention-item-right' onClick={ () => handleCancelAttention(data) }>
          <Icon type={ require('svg/shangcheng/attention_fill_ff.svg') } size='md' />
          <span className='line-1'>取消关注</span>
        </p>
      </li>
    )
  }
}
