import React from 'react'
import { browserHistory } from 'react-router'
import { moment } from '@boluome/common-lib'
import { OrderDetail as OrderDetailCommon, Loading } from '@boluome/oto_saas_web_app_component'
import { Toast, List, WhiteSpace, Icon } from 'antd-mobile'
import { get, send, afterOrdering, login } from 'business'

import '../styles/order-details.scss'

const LItem = List.Item

export default class OrderDetails extends React.Component {
  constructor(props) {
    super(props)
    console.log('history', history.length)
    this.state = {
      orderData: '',
    }
    this.handleToEvaluation = this.handleToEvaluation.bind(this)
    this.handleConfirmService = this.handleConfirmService.bind(this)
    this.getOrderStatus = this.getOrderStatus.bind(this)
  }
  componentWillMount() {
    this.getOrderStatus()
  }

  getOrderStatus() {
    // 设置serverUrl
    const closeLoading = Loading()
    const id = location.pathname.split('/')[4]
    const orderType = location.pathname.split('/')[2]
    get(`/order/v1/${ orderType }/${ id }/info`).then(({ code, data, message }) => {
      if (code === 0) {
        this.setState({ orderData: data })
      } else {
        Toast.fail(message)
      }
      closeLoading()
    })
  }

  handleToEvaluation() {
    const { id, orderType, serviceMsgList, brandLogo } = this.state.orderData
    browserHistory.push(`/daojia/user-comment?orderId=${ id }&orderType=${ orderType }&brandImage=${ brandLogo }&serviceId=${ serviceMsgList[0].serviceId }`)
  }

  handleConfirmService() {
    const closeLoading = Loading()
    const { id, orderType } = this.state.orderData
    send('/daojia/v1/order/update', { orderId: id, orderType, code: 4 }, 'PUT').then(({ code, data, message }) => {
      if (code === 0) {
        console.log('update', data)
        this.getOrderStatus()
      } else {
        Toast.fail(message)
      }
      closeLoading()
    })
  }

  render() {
    const { orderData } = this.state
    if (!orderData) return <div />
    const { id, orderType } = orderData
    return (
      <div className='haufei-order'>
        <OrderDetailCommon { ...{ id, orderType, goPay: () => afterOrdering(orderData), content: <Content { ...orderData } />, handleToEvaluation: this.handleToEvaluation, handleConfirmService: this.handleConfirmService, login } } />
      </div>
    )
  }
}

const Content = ({ brandId, brandLogo, brandName, serviceMsgList, servicePhone, contact, serviceTime, remark, id, creatAt, platformActivity, coupon, price }) => {
  const { name, purchaseQuantity, unitPrice } = serviceMsgList[0]
  const ServiceAddress = () => (
    <div>
      <p>{ `${ contact.name } ${ contact.gender ? '女士' : '男士' }` }</p>
      <p>{ contact.phone }</p>
      <p>{ `${ contact.province === contact.city ? '' : contact.province }${ contact.city }${ contact.county }${ contact.detail ? contact.detail : '' }${ contact.houseNum ? contact.houseNum : '' }` }</p>
    </div>
  )
  return (
    <List className='daojia-order-content'>
      <WhiteSpace size='md' />
      <LItem className='brand-info' arrow='horizontal' onClick={ () => browserHistory.push(`/daojia/lijisong/business?brandId=${ brandId }`) }>
        <p>
          <img src={ brandLogo } alt='' />
          <span>{ brandName }</span>
        </p>
      </LItem>
      <LItem extra={ <div><span>{ `x${ purchaseQuantity }` }</span><span>{ `¥${ unitPrice }` }</span></div> } className='good-info'>{ name }</LItem>
      {
        platformActivity &&
        <LItem extra={ `- ¥${ platformActivity.price }` } className='activity-price'>
          <div>
            <span>减</span>
            <span>{ platformActivity.title }</span>
          </div>
        </LItem>
      }
      {
        coupon &&
        <LItem extra={ `- ¥${ coupon.price }` } className='coupon-price'>
          <div>
            <span>红</span>
            <span>{ coupon.title }</span>
          </div>
        </LItem>
      }
      <LItem extra={ <p>实付 <span>{ `¥${ price }` }</span></p> } className='order-price'>
        <p>
          <a href={ `tel:${ servicePhone }` }><Icon type={ require('svg/phone.svg') } size='sm' /></a>
          <span>联系商家</span>
        </p>
      </LItem>
      <WhiteSpace size='md' />
      <LItem className='service-address' extra={ <ServiceAddress /> }>服务地址</LItem>
      <LItem extra={ serviceTime }>服务时间</LItem>
      <LItem className='remark' extra={ remark.length > 14 ? `${ remark.slice(0, 14) }...` : remark }>备注</LItem>
      <WhiteSpace size='md' />
      <LItem extra={ id }>订单编号</LItem>
      <LItem extra={ moment('YYYY-MM-DD HH:mm')(creatAt) }>下单时间</LItem>
      <LItem extra='在线支付'>支付方式</LItem>
    </List>
  )
}
