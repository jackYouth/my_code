/*
  该组件是orderId页面，下方支付，评价所用的公共组件
*/

import React from 'react'
import { getStore } from '@boluome/common-lib'
import { ExchangeActivePopup } from '@boluome/oto_saas_web_app_component'
import { Popup, Icon } from 'antd-mobile'

import DetailList from './detail-list'
import Evaluate from './evaluate'

import '../styles/pay-footer.scss'

export default class PayFooter extends React.Component {
  constructor(props) {
    super(props)
    const { currentOrderInfo } = props
    console.log('currentOrderInfo', currentOrderInfo)
    this.state = {
      showEvaluate:   false,
      showDetail:     false,
      showBottomMask: '',
      promotionData:  {},
    }
    this.handleToEvaluate = this.handleToEvaluate.bind(this)
    this.handleDetails = this.handleDetails.bind(this)
    this.handleMaskClick = this.handleMaskClick.bind(this)
    this.closeActivityPopup = this.closeActivityPopup.bind(this)
    this.openActivityPopup = this.openActivityPopup.bind(this)
    this.handlePromotionCallback = this.handlePromotionCallback.bind(this)
  }

  // 显示评价的弹出框
  handleToEvaluate(showEvaluate, rate) {
    const { handlePlaceEvaluate, currentOrderInfo } = this.props
    this.setState({ showEvaluate: !showEvaluate })
    Popup.show(<Evaluate { ...{ handlePlaceEvaluate, currentOrderInfo, rate } } />, { animationType: 'slide-up', maskClosable: false })
  }

  handleDetails(e) {
    // if (this.closeSlide) {
    //   this.closeSlide()
    //   this.closeSlide = undefined
    // } else {
    //   const { handelRulesClick, currentOrderInfo } = this.props
    //   this.closeSlide = Mask(<SlidePage showClose={ false } style={{ background: 'none' }} target='down'><MyDetailList { ...{ handelRulesClick, currentOrderInfo } } /></SlidePage>, { style: { zIndex: '9' } })
    // }
    e.stopPropagation()
    const { showDetail, showBottomMask } = this.state
    if (showBottomMask) return
    this.setState({ showDetail: !showDetail })
  }
  handleMaskClick() {
    this.setState({ showDetail: false })
  }
  closeActivityPopup() {
    this.setState({ showBottomMask: false })
  }
  openActivityPopup() {
    this.setState({ showBottomMask: true })
  }
  handlePromotionCallback(promotionData) {
    this.setState({ promotionData })
  }

  render() {
    const { showEvaluate, showDetail, promotionData } = this.state
    const { handleToPay, currentStatus, currentOrderInfo, handelRulesClick } = this.props
    const { id, price, rate } = currentOrderInfo
    const { discount = 0, coupon, activities } = promotionData
    const couponId = coupon ? coupon.id : ''
    const activityId = activities ? activities.id : ''
    let { showBottomMask } = this.state
    if (showBottomMask === '' && currentOrderInfo.status === 2 && discount) {
      showBottomMask = true
    }
    const channel = getStore('channel', 'session')
    const isSinglePrice = getStore('isSinglePrice', 'session')
    return (
      <div style={ showDetail ? { height: '100%', width: '100%', background: 'rgba(0, 0, 0, .3)', position: 'fixed', bottom: '0', zIndex: '1' } : {} } onClick={ this.handleMaskClick }>
        <div className='pay-footer'>
          {
            showDetail &&
            <MyDetailList { ...{ handelRulesClick, currentOrderInfo } } />
          }
          <p className='pay-footer-left'>
            <span>{ `¥ ${ price - discount }` }</span>
          </p>
          {
            currentStatus === 4 && !isSinglePrice &&
            <p className='pay-footer-right' onClick={ () => handleToPay({ id, activityId, couponId }) }>立即支付</p>
          }
          {
            currentStatus === 5 &&
            <p className='pay-footer-right' onClick={ () => this.handleToEvaluate(showEvaluate, rate) }>
              { rate ? '已评价' : '评价本次服务' }
            </p>
          }
          <div className='pay-footer-middle'>
            <p className='details' onClick={ e => this.handleDetails(e) }>明细</p>
            {
              currentStatus === 4 && !isSinglePrice &&
              <ExchangeActivePopup selfClass='pay-footer-active-popup' orderType='yongche' channel={ channel } amount={ price } promotionCallback={ this.handlePromotionCallback } popupStyle={{ top: '-1.23rem' }} handleCloseCallback={ this.closeActivityPopup } handleOpenCallback={ this.openActivityPopup } />
            }
          </div>
        </div>
        {
          Boolean(showBottomMask) &&
          <div style={{ height: '1.23rem', width: '100%', background: 'rgba(0, 0, 0, .3)', position: 'fixed', bottom: '0', zIndex: '1' }} />
        }
      </div>
    )
  }
}


// 订单详情demo
const MyDetailList = ({ handelRulesClick, currentOrderInfo }) => {
  const { price, charges = [] } = currentOrderInfo
  const detailText = charges.map(o => ({ left: o.name, right: o.amount }))
  return (
    <div className='details-list-container'>
      <DetailList { ...{ title: '费用明细', price, detailText } } />
      <p onClick={ handelRulesClick } className='price-detail'>
        <span>计价规则</span>
        <Icon type={ require('svg/yongche/problem.svg') } size='md' />
      </p>
    </div>
  )
}
