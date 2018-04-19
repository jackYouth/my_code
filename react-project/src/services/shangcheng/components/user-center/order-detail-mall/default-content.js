import React from 'react'
import { List } from 'antd-mobile'
import moment from 'moment'

import loc from './loc.png'
import expressImg from './express.png'

const Item = List.Item

// 默认显示内容，除非props传值content，否则显示一下内容
export default class DefaultContent extends React.Component {
  handleRefund(id, status, refundOrderId, orderType, shopId, shopOrderType) {
    if (status === 3 || status === 4 || status === 9) window.location.href = `${ window.location.origin }/shangcheng/refund/${ orderType }/${ id }?shopId=${ shopId }&shopOrderType=${ shopOrderType }`
    // 如果属于退款处理中的状态，就跳转至退款信息页面
    else window.location.href = `${ window.location.origin }/shangcheng/refundInfo/refund/${ refundOrderId }`
    // if (status !== 0) window.location.href = `${ window.location.origin }/shangcheng/refundInfo/refund/${ id }`
  }
  getCommodityDisplay(status) {
    switch (status) {
      case 3:
      case 9:
        return '退款'
      case 4:
        return '申请售后'
      case 6:
        return '退款中'
      case 7:
        return '已退款'
      case 11:
        return '等待退款'
      case 27:
        return '退款申请中'
      case 29:
        return '退货中'
      case 30:
        return '等待退货'
      default:
        return ''
    }
  }
  render() {
    const { orderDetailInfo, imgUrl, refundAllOrder } = this.props
    const { brandId, paidAt, paymentSerial, icon, price, createdAt, id, contact = {}, express = {}, subOrders = [], orderType, displayStatus } = orderDetailInfo
    const { name, gender = 0, phone, city, county, address } = contact
    const { expressPrice, expressInfoList = [] } = express
    const createdDate = new Date(createdAt)
    const expressDate = expressInfoList.length > 0 ? expressInfoList[expressInfoList.length - 1].time : ''
    let totalCommodityPrice = 0
    return (
      <div className='DefaultContent-container'>
        <div className='DefaultContent-header-container'>
          <div className='colorful-container'>
            <img src={ imgUrl } alt='colorful-container' />
            { displayStatus }
          </div>
          {
            expressInfoList.length > 0 ?
              <div className='express-container'>
                <img src={ expressImg } alt='colorful-container' />
                <div className='express-box'>
                  <p>{ expressInfoList[0].context }</p>
                  <p>{ expressInfoList[0].time }</p>
                </div>
              </div>
            : ''
          }
          <div className='contact-container'>
            <img src={ loc } alt='colorful-container' />
            <div className='contact-info-box'>
              <p>
                <span>{ name }</span>
                <span>{ gender === 0 ? '先生' : '女士' }</span>
                <span>{ phone }</span>
              </p>
              <p>{ `${ city }${ county }${ address }` }</p>
            </div>
          </div>
        </div>
        <div className='order-info-container'>
          <Item arrow='horizontal' thumb={ icon } onClick={ () => { window.location.href = `${ window.location.origin }/shangcheng/${ brandId }` } }>
            { orderDetailInfo.name }
          </Item>
          {
            subOrders.length > 0 ?
              <div className='commodity-list-container'>
                {
                  subOrders.map(o => {
                    const { commodityName, specificationName, specificationId, unitPrice, purchaseQuantity, applyCount, refundOrderId } = o
                    const commodityStatus = o.status
                    const commodityDisplay = this.getCommodityDisplay(o.status)
                    totalCommodityPrice += unitPrice * purchaseQuantity
                    return (
                      <div className='commodity-list-box' key={ specificationId }>
                        <div className='commodity-img-box'>
                          <img src={ o.icon } alt={ commodityName } />
                        </div>
                        <div className='commodity-info-container'>
                          <div className='commodity-info-box'>
                            <div className='commodityName'>{ commodityName }</div>
                            <div className='specificationName'>{ specificationName }</div>
                          </div>
                          <div className='commodity-price-box'>
                            <span>{ `¥${ unitPrice }` }</span>
                            <span>{ `x${ purchaseQuantity }` }</span>
                          </div>
                        </div>
                        {
                          // 当状态为已支付，已完成，处理中，并且申请退款次数不存在或小于2次时，显示退款／售后按钮
                          commodityDisplay && applyCount !== 2 && !refundAllOrder &&
                          <div className='refund-container'>
                            <span className='refund-box' onClick={ () => this.handleRefund(o.id, commodityStatus, refundOrderId, o.orderType, id, orderType) }>{ commodityDisplay }</span>
                          </div>
                        }
                      </div>
                    )
                  })
                }
                <div className='commodity-sum-price-container'>
                  <p><span>商品总价</span><span>{ `¥ ${ totalCommodityPrice }` }</span></p>
                  <p><span>运送费</span><span>{ `¥ ${ expressPrice }` }</span></p>
                  <p><span>订单总价</span><span>{ `¥ ${ price }` }</span></p>
                  <p><span>实付款</span><span>{ `¥ ${ price }` }</span></p>
                </div>
              </div>
            : ''
          }
        </div>
        <div className='basis-info-container'>
          <p>{ `订单编号：${ id }` }</p>
          {
            paymentSerial &&
            <p>{ `交易流水号：${ paymentSerial }` }</p>
          }
          <p>{ `创建时间：${ moment(createdDate).format('YYYY-MM-DD HH:mm') }` }</p>
          { paidAt ? <p>{ `付款时间：${ moment(paidAt).format('YYYY-MM-DD HH:mm') }` }</p> : '' }
          { expressDate ? <p>{ `发货时间：${ expressDate }` }</p> : '' }
        </div>
      </div>
    )
  }
}
