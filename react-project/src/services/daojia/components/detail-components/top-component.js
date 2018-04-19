import React, { Component } from 'react'
import { List, Popup, Icon } from 'antd-mobile'

import CommentItem from '../common-component/comment-item'
import ReserveTime from './reserve-time'
import Specification from './specification'

const LItem = List.Item

export default class TopComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAllTimes: false,
    }
  }

  componentDidUpdate() {
    return true
  }

  handleCloseClick() {
    Popup.hide()
  }

  render() {
    const { goodDetails, handleBusinessNameClick, handleMoreCommentClick, allTimes, handleSpecClick, handleBtnClick, currentSpec, topComponentStyle } = this.props
    const {
      serviceDetailsImg, serviceName, brand, orderComment, commentCount, goodCommentCount, time, dayArray, cutTimePoint,
      specificationsList, serviceThumbnailImg,
      statusDescription,
      sellPrice, maxSellPrice, unitName,
    } = goodDetails
    // hasSpec 表示当前是否是多规格
    const hasSpec = specificationsList && specificationsList.length > 0
    const { brandId, brandName, brandSlogan, serviceCount, smallLogoImg } = brand
    return (
      <div className='detail-top detail-container' style={ topComponentStyle }>
        <div className='good-info'>
          <img src={ serviceDetailsImg } alt={ serviceName } />
          <LItem
            extra={
              maxSellPrice ?
                <p>¥<span>{ sellPrice }</span> ~ ¥<span>{ maxSellPrice }</span>/{ unitName }</p> :
                <p>¥<span>{ sellPrice }</span>/<span>{ unitName }</span></p>
            }
            className='good-name'
          >
            { serviceName }
          </LItem>
          {
            hasSpec &&
            <LItem arrow='horizontal' className='spec' onClick={ () => Popup.show(<Specification { ...{ currentSpec, specificationsList, serviceThumbnailImg, handleSpecClick, handleBtnClick, goodDetails, statusDescription, handleCloseClick: this.handleCloseClick, maxSellPrice, unitName, sellPrice } } />, { animationType: 'slide-up', maskClosable: true }) }>
              { !currentSpec ? '请选择规格' : `已选 ${ currentSpec.commodityName }` }
            </LItem>
          }
        </div>
        {
          Boolean(commentCount) &&
          <div className='comment'>
            <LItem
              className='comment-header'
              arrow='horizontal'
              extra={
                <span className='good-comment'>
                  <Icon type={ require('svg/daojia/good_comment.svg') } size='xs' />
                  { `好评数：${ goodCommentCount }` }
                </span>
              }
              onClick={ handleMoreCommentClick }
            >
              用户评价
            </LItem>
            {
              orderComment &&
              <CommentItem data={ orderComment } />
            }
          </div>
        }
        <div className='reserve-time'>
          <LItem arrow='horizontal' extra='全部时间' className='header' onClick={ () => Popup.show(<ReserveTimePopup { ...{ time: allTimes.time, dayArray: allTimes.dayArray, cutTimePoint: allTimes.cutTimePoint } } />, { animationType: 'slide-up', maskClosable: true }) }>
            <p>
              可预约时间&nbsp;&nbsp;
              <span className='green-bg' />&nbsp;
              <span className='text'>可约</span>&nbsp;&nbsp;
              <span className='white-bg' />&nbsp;
              <span className='text'>不可约</span>
            </p>
          </LItem>
          <ReserveTime { ...{ time, dayArray, cutTimePoint } } />
        </div>
        <div className='brand-info'>
          <dl className='brand-name' onClick={ () => handleBusinessNameClick(brandId) }>
            <dt><img src={ smallLogoImg } alt={ brandName } /></dt>
            <dd>
              <h1>{ brandName }</h1>
              <p>{ brandSlogan }</p>
            </dd>
          </dl>
          <ul className='brand-number'>
            <li>
              <h1>{ serviceCount }</h1>
              <p>服务次数</p>
            </li>
            <li>
              <h1>{ brand.goodCommentCount }</h1>
              <p>好评数</p>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

const ReserveTimePopup = ({ time, dayArray, cutTimePoint }) => {
  return (
    <div className='reserve-time'>
      <LItem extra={ <Icon type='cross' size='xxs' onClick={ () => Popup.hide() } /> } className='header'>
        <p>
          可预约时间&nbsp;&nbsp;
          <span className='green-bg' />&nbsp;
          <span className='text'>可约</span>&nbsp;&nbsp;
          <span className='white-bg' />&nbsp;
          <span className='text'>不可约</span>
        </p>
      </LItem>
      <ReserveTime { ...{ time, dayArray, cutTimePoint } } />
    </div>
  )
}
