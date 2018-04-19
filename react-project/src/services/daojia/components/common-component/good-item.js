import React, { Component } from 'react'
import { Icon, Toast } from 'antd-mobile'

import '../../styles/good-item.scss'

const GoodItem = ({ data, onClick }) => {
  const { serviceThumbnailImg, serviceName, brandName, sellPrice, goodCommentCount, statusDescription, isCanService, count, checkNum, maxSellPrice, unitName } = data
  return (
    <li className='good-item' onClick={ onClick ? () => onClick(data) : '' }>
      <div className='left'>
        <img src={ serviceThumbnailImg } alt={ serviceName } />
        {
          statusDescription && isCanService !== false &&
          <p>
            <span>{ statusDescription }</span>
          </p>
        }
        {
          isCanService === false &&
          <p>
            <span>不支持<br />当前地址</span>
          </p>
        }
      </div>
      <div className='right'>
        <p className='top'>{ serviceName }</p>
        <p className='middle'>{ brandName }</p>
        <p className='bottom'>
          <span className='price'>
            { maxSellPrice ? `¥${ sellPrice } ~ ¥${ maxSellPrice }/${ unitName }` : `¥${ sellPrice }/${ unitName }` }
          </span>
          {
            goodCommentCount !== undefined &&
            <span className='good-comment'>
              <Icon type={ require('svg/daojia/good_comment.svg') } size='xs' />
              { `好评数：${ goodCommentCount }` }
            </span>
          }
        </p>
        {
          Boolean(count) && !checkNum &&
          <span className='good-count'>{ `x ${ count }` }</span>
        }
        {
          Boolean(count) && checkNum &&
          <ChangeGoodCount count={ count } { ...checkNum } />
        }
      </div>
    </li>
  )
}

export default GoodItem


class ChangeGoodCount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 1,
    }
  }
  componentWillReceiveProps(nextProps) {
    const { count } = nextProps
    const preCount = this.state.count
    if (count !== preCount) this.setState({ count })
  }
  handleAddClick(count) {
    const { handleChangeCount, currentDate, serviceCount } = this.props
    if (!currentDate) {
      Toast.info('请先选择服务时间')
      return
    }
    if (count >= serviceCount) {
      Toast.info('已经到达最大购买数量')
      return
    }
    count++
    handleChangeCount(count)
  }
  handleSubClick(count) {
    const { handleChangeCount, currentDate, minQuantity } = this.props
    if (!currentDate) {
      Toast.info('请先选择服务时间')
      return
    }
    if (count <= minQuantity) {
      Toast.info(`${ minQuantity }份起购买`)
      return
    }
    count--
    handleChangeCount(count)
  }
  render() {
    const { count } = this.state
    const { minQuantity } = this.props
    return (
      <div className='change-good-count good-count'>
        <Icon onClick={ () => this.handleSubClick(count) } type={ count <= minQuantity ? require('svg/daojia/sub_disable.svg') : require('svg/daojia/sub.svg') } size='md' />
        <span>&nbsp;{ count }&nbsp;</span>
        <Icon onClick={ () => this.handleAddClick(count) } type={ require('svg/daojia/add.svg') } size='md' />
      </div>
    )
  }
}
