/*
  最大购买数量，是选择的服务时间中的serviceCount字段，checkNum是用来表示是否有加减按钮的
*/

import React, { Component } from 'react'
import { Mask, SlidePage, ContactShow, Contact, NewPromotion } from '@boluome/oto_saas_web_app_component'
import { List, InputItem, Picker, Popup } from 'antd-mobile'

import TimeSelector from './order-component/time-selector'
import GoodItem from './common-component/good-item'
import PayFooter from './common-component/pay-footer'
import PersonalitySelector from './order-component/personality-selector'

import '../styles/order.scss'

const LItem = List.Item

export default class Order extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentDate:  '',
      currentTime:  '',
      remark:       '',
      serviceCount: 0,
    }
    this.handleSuccess = this.handleSuccess.bind(this)
    this.handleSelectTime = this.handleSelectTime.bind(this)
    this.handleRemarkChange = this.handleRemarkChange.bind(this)
  }
  handleSuccess() {
    const { handleSelectAddress, selectGood } = this.props
    // const { contactId } = contact
    const { serviceId } = selectGood.goodDetails
    // const paras = {
      // serviceId,
      // contactId,
    // }
    Mask(
      <SlidePage target='right' type='root' showClose={ false }>
        <Contact source='daojia' handleChange={ contact => handleSelectAddress(contact, serviceId) } />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  handleSelectTime(currentDate, currentTime, serviceCount) {
    this.setState({ currentDate, currentTime, serviceCount })
  }
  handleRemarkChange(remark) {
    this.setState({ remark })
  }
  render() {
    const {
      contact = '', selectGood, industryCode,
      handlePromotion, promotionData = {},
      addressAvail, handlePlaceClick,
      personality, handleSelectConfirm, personalityList = [],
      handleChangeCount, count = 1,
    } = this.props
    if (!selectGood) return <div />
    const { currentDate, currentTime, remark, serviceCount } = this.state
    const { goodDetails, currentSpec } = selectGood
    const { serviceThumbnailImg, serviceId, minQuantity, checkNum, unitName } = goodDetails
    const defaultRemark = goodDetails.remark
    let { sellPrice, serviceName, originalPrice } = goodDetails
    let orderServiceMsgList = [{ serviceId, purchaseQuantity: count }]
    if (currentSpec) {
      sellPrice = currentSpec.sellPrice
      serviceName = currentSpec.commodityName
      originalPrice = currentSpec.originalPrice
      orderServiceMsgList = [{ serviceId, purchaseQuantity: count, specificationsId: currentSpec.specificationsId }]
    }
    const data = { serviceThumbnailImg, serviceName, sellPrice, originalPrice, count, unitName }
    if (checkNum) data.checkNum = { serviceCount, minQuantity, handleChangeCount, currentDate }

    let couponId = ''
    let activityId = ''
    let contactId = ''
    const { coupon, activities, discount } = promotionData
    if (coupon) couponId = coupon.id
    if (activityId) activityId = activities.id
    if (contact) contactId = contact.contactId
    const orderParas = {
      couponId,
      activityId,
      contactId,
      orderServiceMsgList,
      remark,
      serviceTime: `${ currentDate } ${ currentTime }`,
      personality: personalityList,
    }
    const mustOptions = [{ title: '配送地址', status: addressAvail }, { title: '服务时间', status: currentDate }]
    return (
      <div className='order'>
        <div className='order-top'>
          <ContactShow { ...{ contact, handleSuccess: this.handleSuccess } } />
          <LItem extra={ currentDate ? `${ currentDate } ${ currentTime }` : '请选择服务时间' } arrow='horizontal' className='time' onClick={ () => Mask(
            <SlidePage showClose={ false }>
              <TimeSelector { ...{ serviceId, handleSelectTime: this.handleSelectTime, currentDate, currentTime } } />
            </SlidePage>)
          }
          >
            服务时间
          </LItem>
          <div className='select-goods'>
            <GoodItem key={ serviceId } { ...{ data } } />
          </div>
          {
            personality && personality.length > 0 &&
            personality.map((item, index) => {
              const { title, multipleChoice, personalityTipList, required } = item
              // status表示当前的选项是否被选择, title表示当前选项的名称
              if (required) mustOptions.push({ title, status: (this.props[`personality${ index }`] && this.props[`personality${ index }`].length > 0) })
              if (multipleChoice) {
                return (
                  <LItem arrow='horizontal' className='personality-popup' key={ item.servicePersonaliseId } extra={ (this.props[`personality${ index }`] && this.props[`personality${ index }`].length !== 0) ? this.props[`personality${ index }`].join('、') : '请选择' } onClick={ () => Popup.show(<PersonalitySelector { ...{ personalityTipList, title, handleSelectConfirm, index, personalityList } } />, { animationType: 'slide-up' }) }>
                    { title }
                  </LItem>
                )
              }
              const datas = personalityTipList.map(ii => ({ label: ii.servicePersonaliseName, value: ii.servicePersonaliseName }))
              return (
                <Picker extra={ this.props[`personality${ index }`] ? this.props[`personality${ index }`] : '请选择' } onChange={ content => handleSelectConfirm(index, content, personalityList, title) } cols={ 1 } key={ item.servicePersonaliseId } data={ datas } title={ title }>
                  <LItem arrow='horizontal' className='personality-picker'>{ title }</LItem>
                </Picker>
              )
            })
          }
          <InputItem
            placeholder={ defaultRemark }
            onChange={ this.handleRemarkChange }
            className='user-tips'
            clear={ 1 }
            maxLength={ 36 }
          >
            备注信息：
          </InputItem>
          <NewPromotion count={ count } orderType={ industryCode } channel='blmdaojia' amount={ sellPrice * count } handleChange={ handlePromotion } />
        </div>
        <PayFooter { ...{ sellPrice: sellPrice * count, discount, handlePlaceClick, orderParas, mustOptions, text: '立即下单' } } />
      </div>
    )
  }
}
