import React from 'react'
import { moment } from '@boluome/common-lib'
import { Icon, Carousel, Modal, List } from 'antd-mobile'
import { keys, all } from 'ramda'

import SellPrice from '../../common-component/sell-price'
import EvaluateItem from '../../common-component/evaluate-item'
import CountDown from '../../common-component/countdown'
import Parameters from './parameters'

import '../../../styles/main/commodity-detail/index.scss'

const CommodityDetail = ({
  commodityDetail, handleSelectParams, currentParamsInfo, handleChangePopup, showPopup = false, handleBrandClick, handleClickCartOrPay,
  handleChangeNum, currentNum = 1,
  commodityStatus, handleModalClick,
  isCollect, handleChangeCollect,
  handleEvaluateClick,
  buttonType, handleToCart,
  totalUnreadNum, handleToMessage,
}) => {
  if (!commodityDetail) return <div />
  const {
    banners, commodityName, commodityId, commodityDescription,
    freightPrice, province, city, parameters, brand, isCollection, purchasesCount, prices, commodityDetails,
    orderCommentBo, goodCommentCount,
    statusDescription,
    activityPageCode, startTime, endTime,
  } = commodityDetail
  const { brandName, bigLogoImg, servicePhone, commodityCount, brandId, commodityScore, expressScore, serviceScore, attentionCount } = brand
  if (isCollect === undefined) isCollect = isCollection
  const getLevel = score => {
    let level = '低'
    if (score === 4.5) level = '中'
    if (score > 4.5) level = '高'
    return level
  }
  const brandScore = [
    { name: '商品描述', score: commodityScore, level: getLevel(commodityScore) },
    { name: '物流服务', score: expressScore, level: getLevel(expressScore) },
    { name: '卖家服务', score: serviceScore, level: getLevel(serviceScore) },
  ]
  const { paramsList, currentPriceInfo } = currentParamsInfo
  let { sellPrice, originalPrice, maxSellPrice, maxOrginalPrice } = commodityDetail
  if (currentPriceInfo) {
    sellPrice = currentPriceInfo.sellPrice
    maxSellPrice = currentPriceInfo.maxSellPrice
    originalPrice = currentPriceInfo.originalPrice
    maxOrginalPrice = currentPriceInfo.maxOrginalPrice
  }
  const topParamsList = keys(paramsList)
  let selectCommodity = ''
  if (topParamsList.length > 0) {
    selectCommodity = topParamsList.reduce((p, r) => {
      p.push(paramsList[r].name)
      return p
    }, [])
    selectCommodity = `已选择 ${ selectCommodity.join(' ') }`
  } else if (parameters.length > 0) {
    selectCommodity = parameters.reduce((p, c) => {
      p.push(c.parameterName)
      return p
    }, [])
    selectCommodity = `选择 ${ selectCommodity.join(' ') }`
  }
  // 当所有的二级规格都只有一种时，默认选中规格且不允许选择规格, allSingle: 是否所有的二级规格都是一个
  let allSubSingle = false
  if (all(e => e.subParameters.length === 1)(parameters)) {
    allSubSingle = true
    // showPopup = false
    currentParamsInfo = {
      paramsList,
      currentPriceInfo: prices[0],
    }
  }
  // noDo: 暂时不做的功能
  const noDo = true
  // 活动页定制
  const hasActivity = activityPageCode
  const isYear = activityPageCode === 'nianhuojie'
  let textHeader = isYear ? '年货价' : '促销价'
  if (!hasActivity) textHeader = ''
  return (
    <div className='commodity-detail-container'>
      {
        !noDo &&
        <h2 className='msg-icon' onClick={ () => handleToMessage(brandId, brandName) }>
          <Icon type={ require('svg/shangcheng/message_ff.svg') } size='md' />
          {
            Boolean(totalUnreadNum) &&
            <span className='sc-badge-icon'>{ totalUnreadNum > 99 ? '99+' : totalUnreadNum }</span>
          }
        </h2>
      }
      <div className='commodity-detail'>
        <div className='banner-carousel'>
          {
            banners.length === 1 ?
              <p className='img-container'><img src={ banners[0] } alt='icon' /></p> :
              <Carousel infinite>
                {
                  banners.map(o => <p className='img-container' key={ o }><img src={ o } alt='icon' /></p>)
                }
              </Carousel>
          }
          {
            hasActivity &&
            <div className='activity-tips'>
              <p>
                <span><Icon type={ isYear ? require('svg/shangcheng/fu.svg') : require('svg/shangcheng/alarm.svg') } size='md' /></span>
                <span>{ isYear ? '年货节' : '限时折扣' }</span>
              </p>
              {
                isYear ?
                  <span>{ `${ moment('YYYY.MM.DD')(startTime) }-${ moment('YYYY.MM.DD')(endTime) }` }</span> :
                  <CountDown endTime={ endTime } timeAfter='后结束' delDay={ 1 } />
              }
            </div>
          }
        </div>
        <div className='commodity-detail-header'>
          <p className='title'>{ `${ commodityName } ${ commodityDescription }` }</p>
          <SellPrice { ...{ sellPrice, maxSellPrice, textHeader } } />
          {
            !isYear &&
            <del className='original-price' style={{ fontSize: '.24rem', lineHeight: '.35rem', color: '#adadad' }}>{ maxOrginalPrice ? `¥${ originalPrice.toFixed(2) } - ¥${ maxOrginalPrice.toFixed(2) }` : `¥${ originalPrice.toFixed(2) }` }</del>
          }
          <p className='freight-price'>
            <span>{ freightPrice === 0 ? '运费：免运费' : `运费：¥${ freightPrice }` }</span>
            <span>{ `销量${ purchasesCount }笔` }</span>
            <span>{ province === city ? city : `${ province }${ city }` }</span>
          </p>
        </div>
        {
          !noDo &&
          <p className='service-text'>
            <Icon type={ require('svg/shangcheng/selected_a.svg') } size='xxs' />
            <span>支持7天无理由退货</span>
          </p>
        }
        {
          !allSubSingle && !statusDescription &&
          <div className='params' onClick={ () => handleChangePopup(true, '') }>
            <span>{ selectCommodity }</span>
            <Icon type='right' size='md' />
          </div>
        }
        {
          Boolean(goodCommentCount) &&
          <div className='detail-evaluate'>
            <List.Item className='detail-evaluate-header' extra={ `好评数：${ goodCommentCount }` } onClick={ () => handleEvaluateClick(commodityId) } arrow='horizontal'>用户评价</List.Item>
            <EvaluateItem data={ orderCommentBo } />
          </div>
        }
        <div className='brand-info' onClick={ () => handleBrandClick(brandId) }>
          <div className='brand-info-header'>
            <p className='brand-info-left'><img src={ bigLogoImg } alt={ brandName } /></p>
            <div className='brand-info-right'>
              <p>{ brandName }</p>
            </div>
          </div>
          <ul className='brand-info-bottom'>
            <li>
              <span>{ commodityCount }</span>
              <p>全部商品</p>
            </li>
            <li>
              <span>{ attentionCount }</span>
              <p>关注人数</p>
            </li>
            <li>
              {
                brandScore.map(o => (
                  <div className='brand-score-item' key={ o.name }>
                    <p>{ o.name }</p>
                    <p>{ o.score }</p>
                    <p>{ o.level }</p>
                  </div>
                ))
              }
            </li>
          </ul>
        </div>
        <div className='commodity-detail-list'>
          <p className='detail-list-header'>商品详情</p>
          <ul className='commodity-detail-item-container'>
            {
              commodityDetails.map(o => (
                <li className='commodity-detail-item' key={ `${ o.imgDescription }_${ o.wordDescription }` }>
                  {
                    o.imgDescription &&
                    <img src={ o.imgDescription } alt={ o.commodityDetailType } />
                  }
                  {
                    o.wordDescription &&
                    <p>{ o.wordDescription }</p>
                  }
                </li>
              ))
            }
            <li className='li-last'>已经全部加载完毕</li>
          </ul>
        </div>
      </div>
      <div className='commodity-detail-footer'>
        <p className='contact' onClick={ () => handleChangeCollect(commodityId, !isCollect) } style={{ WebkitFlexDirection: 'column' }}>
          <Icon type={ isCollect ? require('svg/shangcheng/collect_fill.svg') : require('svg/shangcheng/collect.svg') } size='xs' />
          <span>{ isCollect ? '已收藏' : '收藏' }</span>
        </p>
        <a className='contact' href={ `tel:${ servicePhone }` } style={{ WebkitFlexDirection: 'column' }}>
          <Icon type={ require('svg/shangcheng/contact.svg') } size='md' />
          <span>客服</span>
        </a>
        <p className='contact' onClick={ handleToCart } style={{ WebkitFlexDirection: 'column' }}>
          <Icon type={ require('svg/shangcheng/cart-99.svg') } size='xs' />
          <span>购物车</span>
        </p>
        <p className='commodity-btn' style={{ background: '#ffab00', color: statusDescription ? 'rgba(255, 255, 255, .15)' : '#fff' }} onClick={ () => handleChangePopup(true, 'cartCommoditys') }>加入购物车</p>
        <p className='commodity-btn' style={{ background: '#ff6e19', color: statusDescription ? 'rgba(255, 255, 255, .15)' : '#fff' }} onClick={ () => handleChangePopup(true, 'orderCommoditys') }>立即购买</p>
      </div>
      {
        showPopup && !statusDescription &&
        <div>
          <div className='s-mask' onClick={ () => handleChangePopup(false, '') } onTouchMove={ e => e.preventDefault() } />
          <Parameters { ...{ commodityDetail, handleSelectParams, currentParamsInfo, handleChangeNum, currentNum, onClose: () => handleChangePopup(false, ''), handleClickCartOrPay, selectCommodity, buttonType } } />
        </div>
      }
      {
        commodityStatus && !commodityStatus.canService &&
        <Modal
          title={ `${ commodityStatus.description }` }
          transparent
          className='commodity'
          maskClosable={ false }
          visible={ commodityStatus && commodityStatus.canService }
          footer={ [{ text: '确定', onPress: handleModalClick }] }
        />
      }
      {
        statusDescription &&
        <p className='commodity-disable'>{ `该商品${ statusDescription }~` }~</p>
      }
    </div>
  )
}

export default CommodityDetail
