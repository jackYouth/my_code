import React from 'react'
import { moment } from '@boluome/common-lib'
import { OrderDetail as OrderDetailDemo, Loading } from '@boluome/oto_saas_web_app_component'
import { Toast, List, WhiteSpace } from 'antd-mobile'
import { afterOrdering, get } from 'business'

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
        <OrderDetailDemo { ...{ id, orderType, goPay: () => afterOrdering(orderData), content: <Content { ...orderData } /> } } />
      </div>
    )
  }
}

const Content = ({ name, orgName, month, billNo, barCode = '', price, orderPrice, id, createdAt, platformActivity, coupon }) => {
  return (
    <List className='huafei-order-content'>
      <LItem extra={ name }>缴费业务</LItem>
      <LItem extra={ orgName }>出账机构</LItem>
      <LItem extra={ month }>账期</LItem>
      <LItem extra={ billNo }>查询号码</LItem>
      <LItem extra={ barCode }>条码</LItem>
      <WhiteSpace size='md' />

      <LItem extra={ `¥${ orderPrice }` }>账单金额</LItem>
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
      <LItem extra={ `实付 ¥${ price }` } className='order-price' />
      <WhiteSpace size='md' />

      <LItem extra={ id } >订单编号</LItem>
      <LItem extra={ moment('YYYY-MM-DD HH:mm')(createdAt) }>下单时间</LItem>
    </List>
  )
}
