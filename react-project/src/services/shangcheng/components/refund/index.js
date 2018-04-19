import React from 'react'
// import { Mask, SlidePage, ContactShow, Contact } from '@boluome/oto_saas_web_app_component'
import { Icon, InputItem, Picker, List, Modal } from 'antd-mobile'

import PicSelect from '../common-component/picture-upload'

import '../../styles/refund/index.scss'

const Refund = ({
  showRefundReason = false,
  handleRefundTypeChange, refundType = '',
  handlePriceChange, refundPrice,
  handleRemarkChange, remark = '',
  handleSelectReason, currentReason = '',
  handleCommodityStatus, currentCommodityStatus = ['未收到货'],
  currentOrderInfo,
  placeRefund,
  priceModalVisible, handleHidePriceModal,
  handleChangeImg, uploadImgs = [],
  shopId, shopOrderType,
}) => {
  if (!currentOrderInfo) return <div />
  const { id, express, status, commodityStatus, multipleRefunds } = currentOrderInfo
  let { orderType, subOrders } = currentOrderInfo
  const { expressPrice } = express
  // 第一个商品
  if (!subOrders) subOrders = [currentOrderInfo]
  const firstCommodity = subOrders[0]
  // 最大退款金额
  let maxPrice = expressPrice
  // 是否实物
  let commodityType = 0
  subOrders.forEach(o => {
    maxPrice += o.unitPrice * o.purchaseQuantity
    if (o.commodityType === 1) commodityType = 1
  })
  maxPrice = maxPrice.toFixed(2)

  // 待发货状态，或为虚拟商品时，直接显示退款原因页
  const ToBeDeliver = (status === 9 && commodityStatus === 0) || commodityType === 1
  if (ToBeDeliver) {
    showRefundReason = true
    refundType = 1
  }

  if (refundPrice === undefined) refundPrice = maxPrice
  let orderId = shopId
  if (!shopId) {
    orderId = id
  } else {
    orderType = shopOrderType
  }
  const paras = {
    orderId,
    reason:             currentReason[0],
    commodityStatus:    currentCommodityStatus[0],
    amount:             Number(refundPrice),
    explain:            remark,
    images:             uploadImgs.map(o => o.url),
    relatedCommodities: [{ id: firstCommodity.id, type: firstCommodity.orderType }],
    isFullRefund:       multipleRefunds === 0,
    refundType,
    orderType,
  }
  return (
    <div className='refund'>
      {
        subOrders.map(o => {
          const { icon, commodityName, specificationName, specificationId } = o
          return (
            <div key={ specificationId } className='refund-header'>
              <p className='refund-header-left'><img src={ icon } alt={ commodityName } /></p>
              <div className='refund-header-right'>
                <p>{ commodityName }</p>
                {
                  specificationName &&
                  <p>{ `已选择 ${ specificationName }` }</p>
                }
              </div>
            </div>
          )
        })
      }
      {
        !showRefundReason &&
        <RefundSelect { ...{ handleRefundTypeChange } } />
      }
      {
        showRefundReason &&
        <RefundWrite { ...{ handlePriceChange, refundPrice, handleRemarkChange, handleSelectReason, currentReason, handleCommodityStatus, currentCommodityStatus, placeRefund: () => placeRefund(paras, maxPrice), maxPrice, expressPrice, refundType, handleChangeImg, uploadImgs } } />
      }
      <Modal
        title=''
        transparent
        maskClosable={ false }
        visible={ priceModalVisible }
        footer={ [{ text: '确定', onPress: handleHidePriceModal }] }
      >
        超出退款最高限额
      </Modal>
    </div>
  )
}

export default Refund

const RefundSelect = ({ handleRefundTypeChange }) => {
  return (
    <div className='refund-bottom'>
      <ul className='refund-select'>
        <li className='refund-select-item' onClick={ () => handleRefundTypeChange(1) }>
          <div className='refund-select-item-left'>
            <p>仅退款</p>
            <p>未收货（包含未签收），或卖家协商同意前提下</p>
          </div>
          <Icon className='refund-select-item-right' type='right' size='md' />
        </li>
        <li className='refund-select-item' onClick={ () => handleRefundTypeChange(2) }>
          <div className='refund-select-item-left'>
            <p>退货退款</p>
            <p>已收到货，需要退换已收到的货物</p>
          </div>
          <Icon className='refund-select-item-right' type='right' size='md' />
        </li>
      </ul>
    </div>
  )
}

const RefundWrite = ({ handlePriceChange, refundPrice, handleRemarkChange, currentReason, handleSelectReason, handleCommodityStatus, currentCommodityStatus, placeRefund, maxPrice, expressPrice, refundType, handleChangeImg, uploadImgs }) => {
  const commodityStatus = [
    { label: '未收到货', value: '未收到货' },
    { label: '已收到货', value: '已收到货' },
  ]
  const reasons = [
    { label: '尺寸拍错/不喜欢/效果不好', value: '尺寸拍错/不喜欢/效果不好' },
    { label: '材质问题', value: '材质问题' },
    { label: '尺寸问题', value: '尺寸问题' },
    { label: '做工瑕疵', value: '做工瑕疵' },
    { label: '颜色/图案/花色/款式等不符', value: '颜色/图案/花色/款式等不符' },
    { label: '卖家发错货', value: '卖家发错货' },
    { label: '假冒品牌', value: '假冒品牌' },
    { label: '收到商品少件/破损/污渍等', value: '收到商品少件/破损/污渍等' },
    { label: '其他', value: '其他' },
  ]
  return (
    <div className='refund-bottom'>
      <div className='refund-write'>
        {
          refundType === 2 &&
          <Picker data={ commodityStatus } cols={ 1 } extra={ currentCommodityStatus } onChange={ handleCommodityStatus }>
            <List.Item arrow='horizontal'>货物状态</List.Item>
          </Picker>
        }
        <Picker data={ reasons } cols={ 1 } extra={ currentReason } onChange={ handleSelectReason }>
          <List.Item arrow='horizontal' >退款原因</List.Item>
        </Picker>
      </div>
      <div className='refund-price'>
        <InputItem
          placeholder='请输入退款金额'
          onChange={ handlePriceChange }
          className='sc-user-tips refund-price-top'
          value={ `¥ ${ refundPrice }` }
        >
          退款金额：
        </InputItem>
        <p className='refund-price-bottom'>{ `最多￥${ maxPrice }，含快递费￥${ expressPrice }扣除优惠金额￥0.00` }</p>
      </div>

      <InputItem
        placeholder='选填'
        onChange={ handleRemarkChange }
        className='sc-user-tips refund-reason'
      >
        退款说明：
      </InputItem>
      <div className='select-pic'>
        <h1>添加商品照片</h1>
        <PicSelect imgs={ uploadImgs } handleChangeImg={ handleChangeImg } imgsLength={ 6 } />
      </div>
      <div className='place-button' onClick={ placeRefund }>提交</div>
    </div>
  )
}
