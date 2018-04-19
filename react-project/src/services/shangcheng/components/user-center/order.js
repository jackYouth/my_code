import React from 'react'
import { getStore } from '@boluome/common-lib'
import { Mask, SlidePage, ContactShow, Contact, Bill } from '@boluome/oto_saas_web_app_component'
import { InputItem } from 'antd-mobile'

import CartBrandItem from '../cart/cart-brand-item'
import SellPrice from '../common-component/sell-price'

import '../../styles/user-center/order.scss'

export default class Order extends React.Component {
  constructor(props) {
    super(props)
    this.handleAddressClick = this.handleAddressClick.bind(this)
  }
  handleAddressClick() {
    const { handleSelectAddress } = this.props
    const source = getStore('industryCode', 'session')
    Mask(
      <SlidePage target='right' type='root' showClose={ false }>
        <Contact source={ source } handleChange={ contact => handleSelectAddress(contact) } />
      </SlidePage>
      , { mask: false, style: { position: 'absolute' } }
    )
  }
  render() {
    const { contact = '', orderCommoditys, currentFreight, handlePlaceClick, handleRemarkChange, remark = '', handleSelectInvoice, invoiceInfo } = this.props
    if (!orderCommoditys) return <div />
    const canPlace = currentFreight || currentFreight === 0
    const { totalPrice, commodityList } = orderCommoditys
    const currentPrice = currentFreight ? Number(totalPrice) + currentFreight : totalPrice
    const invoiceId = invoiceInfo ? invoiceInfo.id : ''
    let canInvoice = false
    commodityList.forEach(o => {
      if (o.canInvoice) canInvoice = true
    })
    return (
      <div className='order'>
        <ContactShow { ...{ contact, handleSuccess: this.handleAddressClick } } />
        <CartBrandItem isOrderPage={ 1 } data={ orderCommoditys } key={ orderCommoditys.brandId } />
        {
          Boolean(canInvoice) &&
          <Bill billBack={ handleSelectInvoice } />
        }
        <p className='freight'>
          <span>快递费</span>
          {
            currentFreight ? <span>{ `¥ ${ currentFreight }` }</span> : <span>免运费</span>
          }
        </p>
        <InputItem
          placeholder='选填，对本次交易的说明'
          onChange={ handleRemarkChange }
          className='sc-user-tips'
        >
          备注信息
        </InputItem>
        <div className='footer'>
          <span className='footer-left'>合计：</span>
          <SellPrice sellPrice={ currentPrice } />
          <p onClick={ () => canPlace && handlePlaceClick(orderCommoditys, contact, remark, invoiceId) } className={ canPlace ? 'footer-right active' : 'footer-right' }>提交订单</p>
        </div>
      </div>
    )
  }
}
