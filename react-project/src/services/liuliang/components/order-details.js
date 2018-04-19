import React from 'react'
import { moment } from '@boluome/common-lib'
import { OrderDetail as OrderDetailDemo, Loading } from '@boluome/oto_saas_web_app_component'
import { Toast, List, WhiteSpace } from 'antd-mobile'
import { get, afterOrdering, login } from 'business'
// import vconsole from 'vconsole'

import '../styles/order-details.scss'

const LItem = List.Item

export default class OrderDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      orderData: '',
    }
  }
  componentWillMount() {
    const closeLoading = Loading()
    const id = location.pathname.split('/')[3]
    const orderType = location.pathname.split('/')[1]
    get(`/order/v1/${ orderType }/${ id }/info`).then(({ code, data, message }) => {
      if (code === 0) {
        this.setState({ orderData: data })
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
        <OrderDetailDemo { ...{ id, login, orderType, goPay: () => afterOrdering(orderData), content: <Content { ...orderData } /> } } />
      </div>
    )
  }
}

const Content = ({ phone, price, orderPrice, flow, id, createdAt, area, platformActivity, coupon }) => {
  phone = `${ phone.slice(0, 3) } ${ phone.slice(3, 7) } ${ phone.slice(7, 11) }`
  return (
    <List className='huafei-order-content'>
      <LItem extra={ `${ phone } ${ area }` } className='phone-number'>充值号码</LItem>
      <LItem extra={ `¥${ orderPrice.toFixed(2) }` } className='face-price'>{ `流量 面值${ flow }` }</LItem>
      {
        platformActivity &&
        <LItem extra={ `- ¥${ platformActivity.price.toFixed(2) }` } className='activity-price'>
          <div>
            <span>减</span>
            <span>{ platformActivity.title }</span>
          </div>
        </LItem>
      }
      {
        coupon &&
        <LItem extra={ `- ¥${ coupon.price.toFixed(2) }` } className='coupon-price'>
          <div>
            <span>红</span>
            <span>{ coupon.title }</span>
          </div>
        </LItem>
      }
      <LItem extra={ `实付 ¥${ price.toFixed(2) }` } className='order-price' />
      <WhiteSpace size='md' />
      <LItem extra={ id } >订单编号</LItem>
      <LItem extra={ moment('YYYY-MM-DD HH:mm')(createdAt) }>下单时间</LItem>
    </List>
  )
}
